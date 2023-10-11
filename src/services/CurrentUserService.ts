import { CurrentUser } from "@/models/CurrentUser";
import { useAppStore } from "@/store/app";
import axios from "axios";
import { redirectToLogin, redirectToInsufficientRoles } from "./CheckLoginService";

const appStore = useAppStore();

export function fetchCurrentUser() {
    appStore.resultList = [];
    axios.get<CurrentUser>("/admin/rest/user").then(response => {
        appStore.currentUser  = response.data;

    }).catch(e => {
        if (e.response.status === 403) {
            if(e.response.headers.has("helpdesk-missing-role")) {
                if(window.location.pathname === "/error") {
                  console.log("User is missing required helpdesk roles");
                } else {
                  redirectToInsufficientRoles();
                }
            } else {
                redirectToLogin();
            }
        }
    });
    console.log("fetchCurrentUser");
}
