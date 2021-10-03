package main

import (
	"log"
	"testing"

	"github.com/jarcoal/httpmock"
	"github.com/joho/godotenv"
)

// Should be find index
func TestIndex(t *testing.T) {
	req := []string{"test", "realm", "array"}
	actual, err := Index(req, "realm")
	// log.Println(actual)
	if err != nil {
		t.Error("error")
		return
	}
	expect := 1
	if actual != expect {
		t.Error("actual ")
	}
}

// Should be not found index
func TestIndexNotFound(t *testing.T) {
	req := []string{"test", "index", "array"}
	actual, err := Index(req, "index2")
	expect := -1
	if actual != expect {
		t.Error("Finde some index ")
	}

	if err == nil {
		t.Error("No err reture")
	}
}

func TestGetRealmFromUri(t *testing.T) {
	str1 := "/auth/admin/realms/bbbbb/roles"
	actual1, err := GetRealmFromUri(str1)
	if err != nil {
		log.Println(err)
		t.Error("err")
	}
	exp := "bbbbb"
	if actual1 != exp {
		log.Println(actual1)
		t.Error("Not same")
	}

	str2 := "/auth/realms/master/protocol/openid-connect/token"
	actual2, err := GetRealmFromUri(str2)
	if err != nil {
		log.Println(err)
		t.Error("err")
	}
	exp2 := "master"
	if actual2 != exp2 {
		log.Println(actual1)
		t.Error("Not same")
	}

	str3 := " /auth/realms/master/.well-known/openid-configuration"
	actual3, err := GetRealmFromUri(str3)
	if err != nil {
		log.Println(err)
		t.Error("err")
	}
	exp3 := "master"
	if actual3 != exp3 {
		log.Println(actual1)
		t.Error("Not same")
	}

	str4 := " /auth/realms/master/realms"
	actual4, err := GetRealmFromUri(str4)
	if err != nil {
		log.Println(err)
		t.Error("err")
	}
	exp4 := "master"
	if actual4 != exp4 {
		log.Println(actual1)
		t.Error("Not same")
	}
}

// Should be not found
func TestGetRealmFromUriFail(t *testing.T) {
	str1 := "/auth/welcome-content/user.png"
	actual1, err := GetRealmFromUri(str1)
	if err == nil {
		log.Println(err)
		t.Error("err")
	}
	exp := ""
	if actual1 != exp {
		log.Println(actual1)
		t.Error("Not same")
	}

	str2 := "/auth/admin/master/console/#/realms"
	actual2, err := GetRealmFromUri(str2)
	if err == nil {
		log.Println(err)
		t.Error("err")
	}
	if actual2 != exp {
		log.Println(actual1)
		t.Error("Not same")
	}

}

// should be find realm
func TestFindRealm(t *testing.T) {

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Fail to load emv file")
	}

	httpmock.Activate()
	defer httpmock.DeactivateAndReset()
	httpmock.RegisterResponder("GET", "http://localhost:3000/tenants/name/test1",
		httpmock.NewStringResponder(200, `{
			"id": 11,
			"uuid": "uuid",
			"tenantName": "test001",
			"keycloakId": "aaa",
			"keycloakUri": "http://localhost:8081"
		}`),
	)

	keycloak, err := FindRealm("test1")
	if err != nil {
		log.Println(err)
		t.Error("err")
	}

	exp := "http://localhost:8081"
	if keycloak != exp {
		log.Println(keycloak)
		t.Error("Error")
	}
}

// should be not find realm
func TestFindRealmFail(t *testing.T) {

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Fail to load emv file")
	}

	httpmock.Activate()
	defer httpmock.DeactivateAndReset()
	httpmock.RegisterResponder("GET", "http://localhost:3000/tenants/name/test1",
		httpmock.NewStringResponder(404, `{
		}`),
	)

	keycloak, err := FindRealm("test1")
	if err == nil {
		log.Println(err)
		t.Error("err")
	}

	exp := "http://localhost:8081"
	if keycloak == exp {
		log.Println(keycloak)
		t.Error("Error")
	}
}
