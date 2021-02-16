package auth

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type user struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	CreatedAt int64  `json:"createdAt"`
}

type userResult struct {
	ID        primitive.ObjectID `bson:"_id" json:"_id"`
	Name      string             `json:"name"`
	Email     string             `json:"email"`
	Password  string             `json:"password"`
	CreatedAt int64              `json:"createdAt"`
}

type userSimple struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	CreatedAt int64  `json:"createdAt"`
}

type respondM struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type respondU struct {
	Success bool       `json:"success"`
	Data    userSimple `json:"data"`
}

func getSignedJWT(id primitive.ObjectID) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)

	claims["id"] = id.Hex()
	claims["exp"] = time.Now().Add(time.Minute * 30).Unix()

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	return tokenString, nil
}

func (user *user) encrypt(password string) {
	hash, bcryptErr := bcrypt.GenerateFromPassword([]byte(password), 12)
	if bcryptErr != nil {
		log.Fatal(bcryptErr)
	}

	user.Password = string(hash)
}
