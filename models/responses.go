package models

type RespondM struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type RespondU struct {
	Success bool         `json:"success"`
	Data    UserResponse `json:"data"`
}

type RespondS struct {
	Success bool        `json:"success"`
	Data    SubResponse `json:"data"`
}

type RespondP struct {
	Success bool         `json:"success"`
	Data    PostResponse `json:"data"`
}

type RespondGetPosts struct {
	Success bool     `json:"success"`
	Data    GetPosts `json:"data"`
}
