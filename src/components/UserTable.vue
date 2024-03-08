<template>
    <v-table density="compact">
    <thead>
      <tr>
        <th class="text-left">
          Benutzername
        </th>
        <th class="text-left">
          Nachname
        </th>
        <th class="text-left">
          Vorname
        </th>
        <th class="text-left">
          E-Mail
        </th>
        <th class="text-left">
          ID (M/P)
        </th>
        <th class="text-left">
          Status / Aktionen
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in appStore.resultList"
        :key="item.keycloakId"
      >
        <td>{{ item.username }}</td>
        <td>{{ item.lastName }}</td>
        <td>{{ item.firstName }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.id }}</td>
        <td>
          <!-- Password set ? -->
          <v-icon icon="mdi-lock" style="color: red;" v-if="item.passwordUpdateRequired" />
          <v-icon icon="mdi-lock" style="color: green;" v-if="!item.passwordUpdateRequired" />
          <!-- Account active ? -->
          <v-icon icon="mdi-close" style="color: red;" v-if="item.accountExpires != -1 && item.accountExpires < Date.now()" />
          <v-icon icon="mdi-check" style="color: green;" v-if="item.accountExpires == -1 || item.accountExpires >= Date.now()" />
            &nbsp;
          <span v-if="item.accountExpires == -1">läuft nie ab</span>
          <span v-if="item.accountExpires != -1" v-text="'Ablauf: ' + dateToString(convertDate(item.accountExpires))"></span>
          <!-- 2FA set ? -->
          <!--<v-icon icon="mdi-key" style="color: red;" v-if="!item.mfaSet" />
          <v-icon icon="mdi-key" style="color: green;" v-if="item.mfaSet" />-->

          <!--<v-btn prepend-icon="mdi-magnify" density="compact" @click="openResetDialog(item)">Details</v-btn>-->
          <v-btn prepend-icon="mdi-lock-reset" density="compact" @click="openResetDialog(item)">Zurücksetzen</v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
  <!--<div class="text-center">
    <v-pagination

      :length="6"
    ></v-pagination>
  </div>-->
</template>
<script lang="ts" setup>
import { User } from '@/models/User';
import { UserOrNull } from '@/models/UserOrNull';
import { resetCredential } from '@/services/UserService';
import { useAppStore } from '@/store/app';

const appStore = useAppStore();

function openResetDialog(user: User) {
    const uon = new UserOrNull();
    uon.content = user;
    appStore.currentResetUser = uon;
    appStore.showResetDialog = true;

}

function getBackgroundColor(user: User) {
  if (user.accountExpires < Date.now()) {
    return "red";
  } else {
    return "";
  }
}

function convertDate(n: number) {

// Longer, equivalent to short version
// return new Date(n/1e4 + new Date(Date.UTC(1601,0,1)).getTime());

// Shorter, more efficient. Uses time value for 1601-01-01 UTC
return new Date(n/1e4 - 1.16444736e13);
}

function dateToString(date: Date) {
  let options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('de-de', options);
}

</script>
