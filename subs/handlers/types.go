package handlers

type SubsReq struct {
	Name  string `json:"name"`
	Order string `json:"order"`
	By    string `json:"by"`
}
