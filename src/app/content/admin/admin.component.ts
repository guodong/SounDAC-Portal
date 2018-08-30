// Core
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { Key } from 'selenium-webdriver';
import { stringify } from '@angular/core/src/util';
import { Utils } from '../../modules/shared/utilities/utils';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})


export class AdminComponent {

  generatedKey: string;

  constructor(
    public auth: AuthService,
    public admin: AdminService,
    public router: Router,
  ) {

  }

  test(){
    console.log(Number(0.01).toFixed(6));
  }

  generateInvitationKey() {
    Utils.generateRandomKey(12);
        }
      }
        
    
    
  

