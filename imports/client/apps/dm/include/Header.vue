<template>
    <div>
        <div class="w3-container">
            <div class="w3-left">
                <!--<img src="/images/logo.png" width="20" height="25">-->
                <!--<a href="/" @click.prevent="mcLink('mpe')">{{prodTag}}&trade;</a>-->
                <a href="/" @click.prevent="mcLink('dm')">
                    <i class="glyphicon glyphicon-home" style="color:mediumvioletred;"></i>
                    <span class="mcHeader">{{prodTag}}&trade;</span>
                </a>
                <small class="text-primary mcBoldLink"> :: {{currentProdName}}</small>
            </div>
            <div class="w3-right">
                <div class="w3-bar">
                    <div class="w3-bar-item">
                    <span v-if="loggedIn">
                        <!--For login user only -->
                        <i class="glyphicon glyphicon-user" style=" color:steelblue;"></i>
                        <label class="text-info">{{mcLabel.welcome}} {{currentUser || userName}}</label> |
                        <a href="userLogout" @click.prevent="userLogout" id="userMainLogout">Logout</a> |
                        <a href="userAccount" @click.prevent="userAccount">My Account</a>
                    </span>
                        <span v-else>
                        <!-- For non-login or new user -->
                    <i class="glyphicon glyphicon-user" style="color:steelblue;"></i>
                        <label class="text-info">{{mcLabel.welcome}} {{userName}}</label> |
                        <a href="userLogin" @click.prevent="userLogin">Login</a> |
                        <a href="userRegister" @click.prevent="userRegister">Register</a>
                    </span>
                    </div>
                    <div v-if="loggedIn" class="w3-bar-item w3-mobile w3-dropdown-hover">
                        <a href="#">
                            <i class="glyphicon glyphicon-briefcase" style="color: tomato"></i>
                            <span class="mcBoldLink">{{mcLabel.solutions}}</span>
                            <span class="caret"/>
                        </a>
                        <div class="w3-dropdown-content w3-blue w3-bar-block w3-round-medium">
                            <a class="w3-bar-item w3-button" v-for="item in serviceMenuItems" :key="item._id"
                               :href="item.servicePath"
                               @click.prevent="serviceName(item)">{{item.serviceName}}</a>
                        </div>
                    </div>
                    <div v-if="loggedIn" class="w3-bar-item w3-mobile w3-dropdown-hover">
                        <a href="#">
                            <i class="glyphicon glyphicon-briefcase" style="color:limegreen;"></i>
                            <span class="mcBoldLink">{{mcLabel.documentation}}</span>
                            <span class="caret"></span>
                        </a>
                        <div class="w3-dropdown-content w3-blue w3-bar-block w3-round-medium">
                            <a class="w3-bar-item w3-button" v-for="item in docMenuItems" :key="item._id"
                               :href="item.servicePath"
                               @click.prevent="serviceName(item)">{{item.serviceName}}</a>
                        </div>
                    </div>
                    <div v-if="loggedIn" class="w3-bar-item w3-mobile w3-dropdown-hover">
                        <a href="#">
                            <i class="glyphicon glyphicon-briefcase" style="color: gold"></i>
                            <span class="mcBoldLink">{{mcLabel.fastLink}}</span>
                            <span class="caret"></span>
                        </a>
                        <div class="w3-dropdown-content w3-blue w3-bar-block w3-round-medium">
                            <a class="w3-bar-item w3-button" v-for="item in fastMenuItems" :key="item._id"
                               :href="item.servicePath"
                               @click.prevent="serviceName(item)">{{item.serviceName}}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--@Nov-28-2016: fixed the dropdown menu issue, using the w3.css option (worked!!!)-->
        <!-- Split button -->
        <div class="w3-container w3-center">
            <div class="w3-bar">
                <div class="w3-bar-item w3-mobile">
                    <input type="text" v-model="searchKeyword" class="mcSearch" name="mcSearch"
                           size="50"
                           :placeholder="mcLabel.search">
                </div>
                <div class="w3-bar-item w3-mobile">
                    <select v-if="Array.isArray(searchCategories) && searchCategories.length > 0" class="form-control" v-model="searchCategory"
                            id="roleGroup" required>
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.cat}}</option>
                        <option v-for="item in searchCategories" :key="item._id" :value="item.codeName">
                            {{ item.codeName }}
                        </option>
                    </select>
                </div>
                <div class="w3-bar-item w3-mobile">
                    <button class="btn btn-default mcButton" @click.prevent="mcSearch">
                        <i class="glyphicon glyphicon-search"></i> {{mcLabel.search}}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
</style>
<script>
import { Meteor } from "meteor/meteor";
import { centralMixin } from "../../../include/mixins/centralMixin";
import { headerMixin } from "../../../include/mixins/headerMixin";

export default {
  name: "dmHeader",
  data() {
    return {
      prodTag: this.$info.getName(),
      loggedIn: false,
      userName: "Guest",
      currentProdName: this.$info.getDMTitle(),
      servicePath: "dm",
      currentDocPath: "mpeUserGuide",
      currentFastPath: "userAccount",
      itemPath: "",
      geoInfo: "",
      searchKeyword: "",
      searchCategory: "Services"
    };
  },
  components: {},
  mixins: [centralMixin, headerMixin],
  methods: {
    serviceName(item) {
      // get the currentProdName from serviceName, localStorage (for page refresh) or initial-default-name
      this.currentProdName =
        item.serviceName ||
        this.$info.getDMTitle() ||
        localStorage.getItem("currentProdName");
      // set currentItem value
      this.$store.dispatch("central/setProdPath", { path: item.servicePath });
      this.$store.dispatch("central/setProdName", { name: item.serviceName });
      // Persist product-path in localStorage for page-refresh
      localStorage.setItem("currentProdPath", item.servicePath);
      localStorage.setItem("currentProdName", item.serviceName);
      // go to solution / service-item page
      this.$router.push({ name: item.servicePath });
    },
    mcLink(pathName = "dm") {
      this.$store.dispatch("central/setProdPath", { path: pathName });
      this.currentProdName = this.$info.getDMTitle();
      // go to solution / service-item page
      this.$router.push({ name: pathName });
    },
    mcSearch() {
      // capture the search-keywords and search-category (default: services)
      this.$store.dispatch("central/setSearchKey", this.searchKeyword);
      this.$store.dispatch(
        "central/setSearchCat",
        this.searchCategory || "Services"
      );
      Session.set({
        mcSearchKey: this.searchKeyword,
        mcSearchCat: this.searchCategory || "Services"
      });

      // change path prior to moving / routing to the category-specific search-page
      const currentState = {
        currentPath: true
      };
      history.pushState(currentState, "mConnect Search Page", "/");

      // route to the search page for the searchCategory
      if (this.searchCategory === "Services") {
        this.$router.push({
          name: "serviceSearch",
          params: {
            keyword: this.searchKeyword
          }
        });
      }
      if (this.searchCategory === "Products") {
        this.$router.push({
          name: "productSearch",
          params: {
            keyword: this.searchKeyword
          }
        });
      }
      if (this.searchCategory === "Locations") {
        this.$router.push({
          name: "locationSearch",
          params: {
            keyword: this.searchKeyword
          }
        });
      }
      if (this.searchCategory === "Organizations") {
        this.$router.push({
          name: "orgSearch",
          params: {
            keyword: this.searchKeyword
          }
        });
      }
      if (this.searchCategory === "People") {
        this.$router.push({
          name: "peopleSearch",
          params: {
            keyword: this.searchKeyword
          }
        });
      }
    },
    userRegister() {
      // logout by deleteToken()
      this.$router.push({ name: "register" });
    },
    userLogin() {
      // go to login page
      this.$router.push({ name: "login" });
    },
    userLogout() {
      // server: logout on the server (remove the access token)
      const userToken = this.$auth.getToken();
      if (userToken) {
        Meteor.call("logoutUser", userToken, (error, result) => {
          if (error) {
            this.isMessage = true;
            this.pageMessage = "Unable to logout on the server.";
          } else if (result.code === "success") {
            this.isMessage = true;
            this.pageMessage = `${result.code}: ${result.value}`;
            // client: logout by deleting token - removeToken()
            this.$auth.removeToken();
            // back to the home page (or login-page), refresh page
            window.location.href = "/";
          } else {
            this.isMessage = true;
            this.pageMessage = `${result.code}: ${result.value}`;
            // back to the home page (or login-page), refresh page
            window.location.href = "/";
          }
        });
      }
    },
    userAccount() {
      this.$router.push({ name: "userAccount" });
    }
  },
  computed: {
    searchCategories() {
      return this.codeItems.filter(item => {
        return item.codeCat === "Search";
      });
    }
  },
  created() {
    // get productName based on the servicePath
    switch (this.servicePath) {
      case "mc":
      case "home":
        this.currentProdName = this.$info.getMCTitle();
        break;
      case "mpe":
        this.currentProdName = this.$info.getMPETitle();
        break;
      case "asset":
        this.currentProdName = this.$info.getAssetTitle();
        break;
      case "pam":
        this.currentProdName = this.$info.getPAMTitle();
        break;
      case "sdm":
        this.currentProdName = this.$info.getSDMTitle();
        break;
      case "fin":
        this.currentProdName = this.$info.getFINTitle();
        break;
      case "hcm":
        this.currentProdName = this.$info.getHCMTitle();
        break;
      case "hms":
        this.currentProdName = this.$info.getHMSTitle();
        break;
      case "ems":
        this.currentProdName = this.$info.getEMSTitle();
        break;
      case "dm":
        this.currentProdName = this.$info.getDMTitle();
        break;
      case "bi":
        this.currentProdName = this.$info.getBITitle();
        break;
    }
  }
};
</script>
