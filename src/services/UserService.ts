import { User } from "@/models/User";
import { useAppStore } from "@/store/app";
import axios from "axios";
import { showAlertMessage } from "./AlertMessageService";
import { checkIfUserIsLoggedIn } from "./CheckLoginService";

const appStore = useAppStore();

export function fetchUsers(searchQuery: string) : void {
    if (!appStore.isWaiting) {
        appStore.isWaiting = true;
        appStore.resultList = [];
        checkIfUserIsLoggedIn(axios.get<User[]>("/admin/rest/users", {
            params: {
                first: 0,
                max: 50,
                q: searchQuery
            }
        }).then(response => {
            appStore.resultList  = response.data;
            appStore.isWaiting = false;

        })).catch(e => {
            showAlertMessage("Suche fehlgeschlagen. Bitte erneut versuchen", "error");
            appStore.isWaiting = false;

        });
        console.log("fetchUsers");
    }
}

export function resetCredential(keycloakId: string, seq: string) : void {
    if (!appStore.isWaiting) {
        appStore.isWaiting = true;
        checkIfUserIsLoggedIn(axios.post("/admin/rest/reset", {
            id: keycloakId,
            seq: seq
        }).then(response => {
            appStore.isWaiting = false;
            appStore.showResetDialog = false;

            if (response.status.valueOf() == 200) {
                showAlertMessage("Zugangsdaten zurückgesetzt", "success");
            } else if (response.status.valueOf() == 410) {
                showAlertMessage("Laufnummer bereits verwendet", "error");
            } else {
                showAlertMessage("Zugangsdaten konnten nicht zurückgesetzt werden", "error");
            }
        })).catch(error => {
            appStore.isWaiting = false;
            appStore.showResetDialog = false;
            console.log(error);
            if (error.response.status.valueOf() == 410) {
                showAlertMessage("Laufnummer bereits verwendet", "error");
            } else {
                showAlertMessage("Zugangsdaten konnten nicht zurückgesetzt werden", "error");
            }
        });
    }
   
}


