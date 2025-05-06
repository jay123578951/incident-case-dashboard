<template>
  <v-app-bar flat app color="white" dark class="border-b px-4">
    <template v-slot:prepend>
      <v-img
        :width="32"
        :height="32"
        src="/images/logo.svg"
        class="mr-2"
      ></v-img>
    </template>
    <v-toolbar-title class="ms-0">
      <span class="text-2xl font-bold tracking-[0.15px]"
        >智慧救災水源管理系統</span
      >
    </v-toolbar-title>
    <v-btn
      icon
      density="compact"
      class="d-flex"
      style="height: 32px !important"
    >
      <v-badge :content="6" color="danger-8">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.003 20C13.0962 20 13.9709 19.125 13.9709 18H10.0038C10.0038 19.125 10.8784 20 12.003 20ZM18.7189 15.3438C18.1254 14.6875 16.9696 13.7188 16.9696 10.5C16.9696 8.09375 15.2828 6.15625 12.9713 5.65625V5C12.9713 4.46875 12.534 4 12.003 4C11.4407 4 11.0034 4.46875 11.0034 5V5.65625C8.69186 6.15625 7.00507 8.09375 7.00507 10.5C7.00507 13.7188 5.84931 14.6875 5.25581 15.3438C5.06839 15.5312 4.97468 15.7812 5.00592 16C5.00592 16.5312 5.38076 17 6.0055 17H17.9692C18.5939 17 18.9688 16.5312 19 16C19 15.7812 18.9063 15.5312 18.7189 15.3438Z"
            fill="#3A3B45"
          />
        </svg>
      </v-badge>
    </v-btn>
    <p class="px-4">管理者 張OO</p>
    <v-btn
      variant="flat"
      color="gray-3"
      class="!text-gray-600"
      style="padding: 0.5rem 1rem !important"
      >登出</v-btn
    >
  </v-app-bar>
</template>

<script setup></script>
