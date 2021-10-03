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

// Defined json respose
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
	KEYCLOAKUri string `json:"url"`
	ISWeiteable bool   `json:"isWriteable"`
}

// Get cat create new keycloak uri
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

	// log.Println(string(body))

	if response.StatusCode != 200 {
		return "", errors.New("Active keycloak is not found error")
	}

	if err != nil {
		return "", err
	}

	keycloakData := new(Keycloak)
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

	// log.Println(realmName)
	response, err := http.DefaultClient.Get(u.String() + "/tenant/name/" + realmName)
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
		return "", errors.New("Realm is not found error")
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
	return -1, errors.New("Not found reaml index")
}

func main() {
	// logger := log.New(os.Stdout, "", log.LstdFlags)
	log.Println("start")

	isDebug := os.Getenv("DEBUG")
	debugFlg, _ := strconv.ParseBool(isDebug)
	if debugFlg {
		log.Println("Load .env")
		err := godotenv.Load(".env")

		if err != nil {
			log.Fatal("Fail to load emv file", err.Error())
		}
	}

	director := func(request *http.Request) {
		request.URL.Scheme = "http"

		// println(request.URL.Path)

		realm, err := GetRealmFromUri(request.URL.Path)
		// Not found realm
		if err != nil || realm == "master" {
			log.Println("Get master")
			masterUri, err := GetMasterKeycloak()

			if err != nil {
				log.Fatalln(err.Error())
			}
			log.Println("master url", masterUri)
			host, _ := url.Parse(masterUri)
			request.URL.Host = host.Host
		}

		// Other than master and empty
		if realm != "" && realm != "master" {
			keycloakUri, err := FindRealm(realm)
			if err != nil {
				log.Println(err.Error())
			}
			host, _ := url.Parse(keycloakUri)
			request.URL.Host = host.Host
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
