// Core
import { NgModule, Injector } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { environment } from '../environments/environment';

// Modules
import { FirebaseModule } from './modules/firebase/firebase.module';
import { MaterialModule } from './modules/material/material.module';
import { SharedModule } from './modules/shared/shared.module';

// Libraries
import * as firebase from 'firebase/app';

// Services
import { AdminService } from './services/admin.service';
import { AdminTestnetService } from './services/admin-testnet.service';
import { AdminUserService } from './services/admin-user.service';
import { AlertService } from './services/alert.service';
import { AuthService } from './services/auth.service';
import { CoinMarketCapService } from './services/coin-market-cap.service';
import { SdacService } from './services/sdac.service';
import { UIService } from './services/ui.service';
import { UserService } from './services/user.service';

// Guards
import { UserGuard } from './services/guards/user.guard';
import { AdminGuard } from './services/guards/admin.guard';
import { ManagementGuard } from './services/guards/management.guard';

// Layout
import { AppComponent } from './app.component';
import { AlertDialogComponent } from './layout/dialogs/alert/alert.dialog.component';
import { DeleteDialogComponent } from './layout/dialogs/delete/delete.dialog.component';
import { ErrorDialogComponent } from './layout/dialogs/error/error.dialog.component';
import { LoadingDialogComponent } from './layout/dialogs/loading/loading.dialog.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { NavbarMenuComponent } from './layout/navbar/menu/menu.component';
import { SearchComponent } from './layout/navbar/search/search.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';

// Components
import { AdminComponent } from './content/admin/admin.component';
import { AdminUsersComponent } from './content/admin/users/users.component';
import { AdminUserEmailDialogComponent } from './content/admin/users/email-dialog/email.dialog.component';
import { AdminTestnetComponent } from './content/admin/testnet/testnet.component';
import { AdminTestnetReportDialogComponent } from './content/admin/testnet/report-dialog/report.dialog.component';
import { HomeComponent } from './content/home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './content/defaults/login/login.component';
import { EmailComponent } from './content/defaults/email/email.component';
import { ModalTransferComponent } from './content/wallet/modal/modal-transfer.component';
import { ModalRedeemComponent } from './content/wallet/modal/modal-redeem.component';
import { ModalKeyComponent } from './layout/sidenav/modals/artist-key/modal-key.component';
import { ModalDialogVestComponent } from './content/wallet/modal/modal-vest.component';
import { ModalWithdrawComponent } from './content/wallet/modal/modal-withdraw.component';
import { PageNotFoundComponent } from './content/defaults/page-not-found/page-not-found.component';
import { RegisterComponent } from './content/defaults/register/register.component';
import { RegisterExternalComponent } from './content/defaults/register-external/register-external.component';
import { TacComponent } from './content/defaults/register/terms-conditions/tac.component';
import { AdvanceComponent } from './content/advance/advance.component';
import { WalletComponent } from './content/wallet/wallet.component';
import { RightsManagementComponent } from './content/rights-management/rights-management.component';
import { ContentComponent } from './content/rights-management/content/content.component';
import { GenreComponent } from './content/rights-management/genre/genre.component';
import { CountriesComponent } from './content/rights-management/countries/countries.component';
import { ProductTypeComponent } from './content/rights-management/product-type/product-type.component';
import { ProsComponent } from './content/rights-management/pros/pros.component';
import { SamplesComponent } from './content/rights-management/samples/samples.component';
import { WriterRolesComponent } from './content/rights-management/writer-roles/writer-roles.component';

import { ModalArtistComponent } from './content/rights-management/modal/artist/modal-artist.component';
import { ModalReviewComponent } from './content/rights-management/modal/review/modal-review.component';
import { ModalPublishersComponent } from './content/rights-management/modal/publishers/modal-publishers.component';
import { ModalWritersComponent } from './content/rights-management/modal/writers/modal-writers.component';

// Firebase Initialization
firebase.initializeApp(environment.rightsManagementPortal, 'rightsManagementPortal'); // Rights Management Portal

firebase.initializeApp(environment.sdacApi, 'sdacApi'); // Sdac API
const firestore = firebase.app('sdacApi').firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'email', component: EmailComponent },
  { path: 'register-external', component: RegisterExternalComponent },
  {
    path: '', component: LayoutComponent, canActivate: [UserGuard], children: [
      { path: '', component: HomeComponent },
      { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
      { path: 'wallet', component: WalletComponent },

      { path: 'advance', component: AdvanceComponent },
      { path: 'content-rights-management', component: RightsManagementComponent, canActivate: [ManagementGuard] },
      { path: 'content-post', component: ContentComponent, canActivate: [ManagementGuard] },

      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  entryComponents: [
    ErrorDialogComponent,
    LoadingDialogComponent,
    AlertDialogComponent,
    DeleteDialogComponent,
    AdminUserEmailDialogComponent,
    AdminTestnetReportDialogComponent,
    ModalTransferComponent,
    ModalRedeemComponent,
    ModalKeyComponent,
    ModalDialogVestComponent,
    ModalWithdrawComponent,
    TacComponent,
    ModalReviewComponent,
    ModalArtistComponent,
    ModalPublishersComponent,
    ModalWritersComponent
  ],
  declarations: [
    AppComponent,
    NavbarComponent,
    SidenavComponent,
    ErrorDialogComponent,
    EmailComponent,
    AlertDialogComponent,
    DeleteDialogComponent,
    LayoutComponent,
    LoadingDialogComponent,
    ModalTransferComponent,
    ModalRedeemComponent,
    ModalKeyComponent,
    ModalDialogVestComponent,
    ModalWithdrawComponent,
    ModalReviewComponent,
    ModalArtistComponent,
    ModalPublishersComponent,
    ModalWritersComponent,
    NavbarMenuComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    RegisterExternalComponent,
    SearchComponent,
    TacComponent,
    PageNotFoundComponent,
    AdvanceComponent,
    WalletComponent,
    AdminComponent,
    AdminUsersComponent,
    AdminTestnetComponent,
    AdminUserEmailDialogComponent,
    AdminTestnetReportDialogComponent,
    ContentComponent,
    RightsManagementComponent,
    GenreComponent,
    CountriesComponent,
    ProductTypeComponent,
    ProsComponent,
    SamplesComponent,
    WriterRolesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FirebaseModule,
    SharedModule,
    HttpClientModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AdminGuard,
    ManagementGuard,
    UserGuard,
    AdminService,
    AdminTestnetService,
    AdminUserService,
    AlertService,
    AuthService,
    CoinMarketCapService,
    SdacService,
    UIService,
    UserService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  // Allow Singleton Injector from Models (Class) outside of constructor
  static injector: Injector;
  constructor(
    injector: Injector
  ) {
    AppModule.injector = injector;
  }

}
