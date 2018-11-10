import { Storage } from "@ionic/storage";
import { TutorialPage } from "./../pages/tutorial/tutorial";
import { DrugProvider } from "./../providers/drug/drug";
import { InvitePage } from "./../pages/invite/invite";
import { SettingsPage } from "./../pages/settings/settings";

import { AboutPage } from "./../pages/about/about";
import { PartnersPage } from "./../pages/partners/partners";
import { TabsPage } from "./../pages/tabs/tabs";
import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, Events } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { OneSignal } from "@ionic-native/onesignal";

const wait = ms => new Promise(r => setTimeout(r, ms));

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;

  rootPage: any;
  menuPages = [
    {
      title: "Home",
      component: TabsPage,
      icon: "home"
    },
    {
      title: "Partners",
      component: PartnersPage,
      icon: "cash"
    },
    {
      title: "Settings",
      component: SettingsPage,
      icon: "cog"
    },
    {
      title: "Invite Your Friends 👌",
      component: InvitePage,
      icon: "share"
    },
    {
      title: "About",
      component: AboutPage,
      icon: "bug"
    }
  ];
  firstTime: boolean;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private ga: GoogleAnalytics,
    private oneSignal: OneSignal,
    private drugProvider: DrugProvider,
    private events: Events,
    public storage: Storage
  ) {
    //not firing at first until flag is set
    //ignored at first app run
    if (localStorage.hasSeenTutorial === "true") {
      this.rootPage = TabsPage;
    } else {
      //first app run go to tutorial page and set flag to true
      this.rootPage = TutorialPage;
      localStorage.hasSeenTutorial = "true";
    }
    this.platformReady();
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      if (this.platform.is("cordova")) {
        //hide splash
        setTimeout(() => {
          this.splashScreen.hide();
        }, 3000);
        //change status bar color
        if (this.platform.is("android")) {
          this.statusBar.backgroundColorByHexString("#7b1fa2");
        }
        //google analytics
        this.startAnalytics();
        //oneSignal
        this.startPushService();
      }
      this.listenToEvents();
      this.startBackgroundJobs();
    });
  }

  startBackgroundJobs() {
    //for better UX
    //load data at first time app launch
    //not has seen tutorial === first time
    if (localStorage.hasSeenTutorial !== "true") {
      //load default data //TODO:get user country and langauge
      this.drugProvider.getAndStoreDrugsByDefaultCountry().subscribe();
    }
  }

  startAnalytics() {
    //start getting analytics
    this.ga
      .startTrackerWithId("UA-88642709-1")
      .then(() => {
        console.log("Google analytics is ready now");
      })
      .catch(e => console.log("Error starting GoogleAnalytics", e));
  }

  startPushService() {
    //start registring and getting pushs
    this.oneSignal.startInit(
      "daaa8674-68e2-49a3-aa58-3844d767a9aa",
      "1061030166084"
    );
    this.oneSignal.handleNotificationReceived().subscribe(jsonData => {
      console.log(JSON.stringify(jsonData));
    });

    this.oneSignal.handleNotificationOpened().subscribe(jsonData => {
      // do something when a notification is opened
      console.log(JSON.stringify(jsonData));
    });

    this.oneSignal.endInit();
  }

  listenToEvents() {
    this.events.subscribe("country:changed", c => {
      console.log("country:changed getAndStoreDrugs for " + c);
      this.drugProvider.getAndStoreDrugsByDefaultCountry().subscribe();
    });
  }

  //menu view method
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

//TODO:make app color changeable and localizable
//TODO:add user rating intellegience and feedback
//TODO: better market MEO
//TODO: change app licence for open source
//TODO: reduce app size by optimizing resources folder ionic cordova resources not very optimized
//TODO: app upload autimation
//TODO: cross-walk support for lower api than 19 > second apk than normal one
//TODO: push updates to appstore
//TODO: handle user segments
//TODO: fix history bugs and rename it and add more functionality
//TODO: add the ability to write prescription and scan drugs
//TODO: add the ability to enter drug by camera or voice
//TODO: fix undefined when click seachbar clear button
//TODO: optimize resources generation >
//TODO: active-user counting implementation
//TODO: fix undefined when after firing cancel event
//TODO: edit report templates
//TODO: be more ready for pwa
//TODO: Charge ppl outside egypt
