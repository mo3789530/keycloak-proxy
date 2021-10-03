package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

// Definde json respose
type Tenant struct {
	ID          int    `json:"id"`
	UUID        string `json:"uuid"`
	TENANTNAME  string `json:"tenantName"`
	KEYCLOAKID  string `json:"keycloakId"`
	KEYCLOAKUri string `json:"keycloakUri"`
}

type Keycloak struct {
	ID          int    `json:"id"`
	UUID        string `json:"uuid"`
	KEYCLOAKID  string `json:"url"`
	KEYCLOAKUri bool   `json:"isWriteable"`
}

// Get writeable keycloak uri
func GetMasterKeycloak() (string, error) {
	uri := os.Getenv("KEYCLOAK_OPERATOR_URL")
	u, err := url.Parse(uri)
	if err != nil {
		log.Fatalln("Keyclaok operator url is invalid format")
	}

	response, err := http.DefaultClient.Get(u.String() + "/keycloak/active")
	if err != nil {
		log.Println(err)
		return "", err
	}
	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)

	if err != nil {
		return "", nil
	}

	keycloakData := new(Tenant)
	if err := json.Unmarshal(body, keycloakData); err != nil {
		return "", err
	}

	return keycloakData.KEYCLOAKUri, nil
}

// Get keycloak uri by tenant name from keycloak operator
func FindRealm(realmName string) (string, error) {
	uri := os.Getenv("KEYCLOAK_OPERATOR_URL")
	u, err := url.Parse(uri)
	if err != nil {
		log.Fatalln("Keyclaok operator url is invalid format")
	}

	response, err := http.DefaultClient.Get(u.String() + "/tenants/name/" + realmName)
	if err != nil {
		log.Println(err)
		return "", err
	}
	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)

	if err != nil {
		log.Println(err)
		return "", err
	}

	if response.StatusCode != 200 {
		return "", errors.New("Not found error")
	}

	tenantData := new(Tenant)
	if err := json.Unmarshal(body, tenantData); err != nil {
		return "", err
	}

	return tenantData.KEYCLOAKUri, nil
}

// Find realm name from url
func GetRealmFromUri(path string) (string, error) {
	arryUrl := strings.Split(path, "/")
	realmIndex, err := Index(arryUrl, "realms")
	if err != nil {
		log.Println(err)
		return "", err
	}
	if len(arryUrl) <= realmIndex+1 {
		log.Println("Out of index")
		return "", errors.New("out of index")
	}
	return arryUrl[realmIndex+1], nil
}

// Find target index from array
func Index(s []string, e string) (int, error) {
	for i, v := range s {
		if v == e {
			return i, nil
		}
	}
	return -1, errors.New("Not found")
}

func main() {

	isDebug := os.Getenv("DEBUG")
	debugFlg, _ := strconv.ParseBool(isDebug)
	if debugFlg {
		log.Println("Load .env")
		err := godotenv.Load(".env")

		if err != nil {
			log.Fatal("Fail to load emv file")
		}
	}

	director := func(request *http.Request) {
		request.URL.Scheme = "http"

		// println(request.URL.Path)

		uri, err := GetRealmFromUri(request.URL.Path)
		if err != nil {
			log.Println(err)
			master, err := GetMasterKeycloak()

			if err != nil {
				log.Fatalln(err)
			}

			request.URL.Host = master

		}
		if uri != "" {
			request.URL.Host = uri
		}

		log.Println(request.URL)
	}

	rp := &httputil.ReverseProxy{Director: director}

	server := http.Server{
		Addr:    ":8080",
		Handler: rp,
	}

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err.Error())
	}

	defer server.Close()
}
