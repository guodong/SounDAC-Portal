// region imports
import { Component, OnInit, AfterViewInit, ViewChild, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MatTableDataSource, MatTable } from '@angular/material';
import { Observable } from 'rxjs/Rx';
import { DataSource } from '@angular/cdk/collections';
import { ModalReviewComponent } from '../modal/review/modal-review.component';
import { ModalPublishersComponent } from '../modal/publishers/modal-publishers.component';
import { ModalArtistComponent } from '../modal/artist/modal-artist.component';
import { ModalWritersComponent } from '../modal/writers/modal-writers.component';
import { AuthService } from '../../../services/auth.service';
import { MuseService } from '../../../services/muse.service';
import { AlertService } from '../../../services/alert.service';
import { AlertBtnText } from '../../../modules/shared/utilities/alert-btn-text.enums';
import { ErrorCodes } from '../../../modules/shared/utilities/error-codes.enums';
import { Enums } from '../content.enums';
import { Utils } from '../../../modules/shared/utilities/utils';
import { UIService } from '../../../services/ui.service';
import { Subscription } from '../../../../../node_modules/rxjs/Subscription';
// import { ContentModel } from '../../../core/models/content.model';

// endregion

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})

export class ContentComponent implements OnInit, AfterViewInit {
 
  constructor(
    private auth: AuthService,
    private _fb: FormBuilder,
    private museService: MuseService,
    private alert: AlertService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private ui: UIService
  ) {
    this.currentDate();
  }
  
  // region variables
  max = 100;
  mastValue;
  streamValue;
  compValue;

  mastMax;
  streamMax;
  compMax;
  total;

  mastMin;
  streamMin;
  compMin;

  step = .5;
  thumbLabel = true;
  // content = new ContentModel();
  subscription: Subscription;
  contentForm: FormGroup;
  formErrors: any;
  dialogRefPublishers: MatDialogRef<ModalPublishersComponent>;
  dialogRefArtist: MatDialogRef<ModalArtistComponent>;
  dialogRefWriters: MatDialogRef<ModalWritersComponent>;
  dialogRefReview: MatDialogRef<ModalReviewComponent>;


  muserName: string;
  maxDate: Date;
  maxYear: number;
  maxBp: number;
  maxPercentage: number;
  genSplitTotal: boolean;
  compRoyaltyRequired: boolean;

  data: any;

  masterRoyaltyInput = {
    muserName: localStorage.getItem('currentUser'),
    income: 100,
    management: null,
    weight: 100
  };

  compRoyaltyInput = {
    muserName: '',
    income: null,
    management: null,
    weight: null
  };

  masterIncomeMax = 100;
  compIncomeMax = 100;

  masterWeightMax = 100;
  compWeightMax = 100;

  masterIncomeTotal = 0;
  masterWeightTotal = 0;
  compIncomeTotal = 0;
  compWeightTotal = 0;

  masterRoyaltyList = [];
  distributionsList = [];
  managementList = [];

  compRoyaltyList = [];
  distributionsCompList = [];
  managementCompList = [];

  trackArtistList = [];
  albumArtistList = [];
  writersList = [];
  publishersList = [];

  masterManagesContract = false;
  compManagesContract = false;
  isOneOwner = false;
  // endregion

  // region to move out of component
  productType = [
    { value: 'Album (Live)' },
    { value: 'Album (Compilation)' },
    { value: 'Album (Studio)' },
    { value: 'EP' },
    { value: 'Music Video' },
    { value: 'Ringtone' },
    { value: 'Single' }
  ];

  explicit = [
    { value: 0, viewValue: 'Yes' },
    { value: 1, viewValue: 'No' },
    { value: 2, viewValue: 'Clean' } // has explicit that has been bleeped out
  ];

  pros = [
    { value: 'ACEMLA' },
    { value: 'ACUM' },
    { value: 'AEPI' },
    { value: 'AGADU' },
    { value: 'AKM' },
    { value: 'APDAYC' },
    { value: 'APRA' },
    { value: 'APRA' },
    { value: 'ARTISJUS' },
    { value: 'ASCAP' },
    { value: 'BMI' },
    { value: 'BUMA' },
    { value: 'CASH' },
    { value: 'COMPASS' },
    { value: 'COTT' },
    { value: 'EAU' },
    { value: 'ECAD' },
    { value: 'FILSCAP' },
    { value: 'GEA' },
    { value: 'GEMA' },
    { value: 'HDS' },
    { value: 'IMA' },
    { value: 'IPRS' },
    { value: 'JASRAC' },
    { value: 'KODA' },
    { value: 'KOMCA' },
    { value: 'KOSCAP' },
    { value: 'LATGA-A' },
    { value: 'MACP' },
    { value: 'MCT' },
    { value: 'MRCSN' },
    { value: 'MUST' },
    { value: 'OSA' },
    { value: 'PPCA' },
    { value: 'PRS, PPL' },
    { value: 'RAO' },
    { value: 'SABAM' },
    { value: 'SACEM' },
    { value: 'SACM' },
    { value: 'SACVEN' },
    { value: 'SADAIC' },
    { value: 'SAMRO' },
    { value: 'SAS' },
    { value: 'SAYCO/ACINPRO' },
    { value: 'SCD' },
    { value: 'SENAPI' },
    { value: 'SGAE' },
    { value: 'SIAE' },
    { value: 'SOKOJ' },
    { value: 'SOZA' },
    { value: 'SPAC' },
    { value: 'SPACEM' },
    { value: 'STIM' },
    { value: 'SUISA' },
    { value: 'TEOSTO' },
    { value: 'TONO' },
    { value: 'UACRR' },
    { value: 'UCMR' },
    { value: 'ZAIKS' }
  ];

  // Samples
  yes_no = [
    { value: true, viewValue: 'Yes' },
    { value: false, viewValue: 'No' }
  ];

  toolTips = {
    trackTitle: 'EACH TRACK TITLE IN AN ALBUM MUST BE UNIQUE, THE EXCEPTION IS DIFFERENT VERSIONS OF THE SAME TRACK, SUCH AS CLEAN/EXPLICIT.',
    url: 'EACH TRACK MUST INCLUDE A UNIQUE INTERPLANETARY FILE SYSTEM (IPFS) URL TO THE TRACK FILE. (ipfs://)',
    sample: 'SPECIFY IF THE TRACK CONTAINS A SAMPLE.',
    trackArtist: 'CLICK TO ADD AT LEAST ONE MAIN ARTIST.',
    trackArtistName: 'ARTIST FULL NAME AND PROPER SPELLING ARE REQUIRED IN THE MOST WIDELY KNOWN FORM.',
    trackArtistAliases: 'A NAME THAT A PERSON OR GROUP ASSUMES, WHICH CAN DIFFER FROM THEIR FIRST OR TRUE NAME ',
    trackArtistIsni: 'THE ISO STANDARD IDENTIFIER FOR NAMES',
    featuredArtist: 'IF THE TRACK CONTAINS FEATURED ARTISTS NOTE: FOR NAMING GROUPS AS WELL AS INDIVIDUALS',
    // IF A TRACK CONTAINS ONE OR MORE , EACH ARTIST MUST BE ADDED SEPARATELY.',
    featuredArtistIsni: 'THE ISO STANDARD IDENTIFIER FOR NAMES',
    isrc: 'A UNIQUE AND PERMANENT IDENTIFIER FOR A SPECIFIC RECORDING, INDEPENDENT OF THE FORMAT OR THE RIGHTS HOLDERS.',
    country: 'RECORDING LOCATION.',
    explicit: 'AN EXPLICIT TRACK MUST BE TAGGED AS EXPLICIT. A CLEAN VERSIONS OF EXPLICIT TRACKS MUST BE TAGGED AS CLEAN. TRACKS SHOULD ONLY BE FLAGGED CLEAN IF THERE IS AN EXPLICIT VERSION OF THE TRACK.',
    genre: 'THE FIRST GENRE MUST BE THE BEST DESCRIPTION FOR THE CONTENT. A SECOND GENRE IS NOT ALWAYS REQUIRED, BUT IT SHOULD BE USED WHEN APPLICABLE.',
    trackPLine: 'THIS IS GENERALLY THE ENTITY ENTITLED TO ROYALTIES FOR THE TRACK.',
    trackNo: 'USED TO ORDER TRACKS WITHIN AN ALBUM.',
    trackVolumeNo: 'THE VOLUME NUMBER (DISC NUMBER) ON WHICH THE TRACK RESIDES.',
    trackDuration: 'THE DURATION OF THE CONTENT USING THE FOLLOWING FORMAT hhmmss. (E.G. TWO MINUTE AND 30 SECONDS WOULD BE 000230)',
    trackProducer: 'A PARTY RESPONSIBLE FOR AN ARTISTIC INPUT TO THE PRODUCTION OF A RESOURCE (E.G. A SOUNDRECORDING OR AUDIOVISUAL RECORDING).',
    releaseDate: 'THE ORIGINAL RELEASE DATE (YYYY/MM/DD) MUST BE THE EARLIEST DATE THAT THE ORIGINAL PRODUCT WAS FIRST RELEASED REGARDLESS OF THE RELEASING LABEL, OR FORMAT TYPE.',
    releaseYear: 'THE ORIGINAL RELEASE DATE YEAR (YYYY)',
    salesStartDate: 'THE SALES START DATE (YYYY/MM/DD) IS THE DATE WHEN CONTENT BECOMES AVAILABLE ON MUSE.',
    upcEan: 'SET OF NUMBERS THAT IDENTIFY A PACKAGED COLLECTION OF MUSIC',
    albumTitle: 'ALBUM TITLE MUST MATCH THE ORIGINAL TITLE UPON ITS INITIAL RELEASE.',
    partOfAlbum: 'CHECK IF DOES THE TRACK BELONGS TO AN ALBUM',
    albumArtist: 'A PRINCIPAL CONTRIBUTOR TO A PERFORMANCE OF THE TRACK. NOTE: FOR NAMING GROUPS AS WELL AS INDIVIDUALS.',
    albumProducer: 'A PARTY RESPONSIBLE FOR AN ARTISTIC INPUT TO THE PRODUCTION OF A RESOURCE (E.G. A SOUNDRECORDING OR AUDIOVISUAL RECORDING).',
    albumType: '',
    albumPLine: '',
    albumCLine: '',
    masterLabel: '',
    displayLabel: '',
    isThirdPartyPublishers: '',
    pros: 'THE ORGANIZATION THAT PROVIDES INTERMEDIARY FUNCTIONS',
    publisher: 'A PARTY THAT MAKES A RESOURCE AVAILABLE',
    writer: ' THE CREATOR OF THE MUSICAL ELEMENTS OF A TRACK.',
    threshold: 'TOTAL WEIGHT FOR A CHANGE TO TAKE PLACE ON THE SMART CONTRACT.',
    oneOwner: 'CHECK HERE IF THE CONTENT IS OWNED AND MANAGED BY THE LOGGED IN USER TO AUTO COMPLETE THE MANAGEMENT AND SPLITS PORTION OF THIS FORM',

    management: '',
    // matTooltipShowDelay
    delay: '1000',
  };

  // endregion

  // region lifecycle 
  ngOnInit() {
    // Get MuserName
    this.subscription = this.auth.user$.subscribe(user => {
      if (user) {
        this.muserName = user.musername;
      }
    });

    // this.content = new ContentModel();
    this.contentForm = this.createContentForm();
    this.contentForm.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
      this.onGeneralSplitsChange();
      this.getGeneralSplitsFormValues();
      this.syncGeneralSplits();
    });
    this.masterManagesContract = false;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // this.ui.hideLoading();
      window.dispatchEvent(new Event('resize'));
    }, 1000);
  }
  // endregion

  // region functions
  createContentForm() {
    return this._fb.group({
      uploader: [this.muserName],
      url: 'ipfs://' + Utils.generateGUID(),

      album_meta: this._fb.group({
        partOfAlbum: false,
        albumTitle: [''],
        albumArtists: [],
        albumGenre1: [''],
        albumGenre2: [''],
        countryOrigin: [''],
        explicit: [''],
        albumPLine: [''],
        albumCLine: [''],
        // TODO: fix validation
        // upcEan: ['', [Validators.pattern('^8\d{11}$|^8\d{13}$')]],
        upcEan: [''],
        releaseDate: ['', Validators.required],
        releaseYear: [''],
        salesStartDate: ['', Validators.required],
        albumProducer: [''],
        albumType: [''],
        masterLabelName: ['', Validators.required],
        displayLabelName: [''],
      }),

      track_meta: this._fb.group({
        trackTitle: ['', Validators.required],
        isrc: [''],
        trackArtists: [],
        featuredArtist: [''],
        featuredArtistIsni: [''],
        trackProducer: [''],
        trackGenre1: [''],
        trackGenre2: [''],
        trackPLine: [''],
        // TODO: fix validation
        // trackNo: ['', [Validators.min(0), Validators.pattern('^[0-9][0-9]*([.][0-9]{2}|)$')]],
        // trackVolumeNo: ['', [Validators.min(0), Validators.pattern('^[0-9][0-9]*([.][0-9]{2}|)$')]],
        // trackDuration: ['', [Validators.pattern('^[0-9][0-9]*([.][0-9]{2}|)$')]],
        // trackDuration: ['', Validators.pattern('^[0-9]*$"')],
        trackNo: [''],
        trackVolumeNo: [''],
        trackDuration: [''],
        hasSample: [''],
      }),

      comp_meta: this._fb.group({
        compTitle: [''],
        compTitleAlt: [''],
        compTitleIswc: [''],
        isThirdPartyPublishers: [false],
        publishers: [],
        writers: [],
        performingRightsOrg: [''],
      }),

      distributions: [],

      management: [],

      management_threshold: [100, [Validators.min(0), Validators.max(100)]],

      distributionsComp: [],

      managementComp: [],

      management_threshold_comp: [100, [Validators.min(0), Validators.max(100)]],

      master_share: [45, [Validators.min(0), Validators.max(100)]], // Only used for clarification in UI.
      // The master_share value doesnt need to be submitted to the chain,
      // the value is inferred from the total balance minus the
      // publishers_share

      publishers_share: [50, [Validators.min(0), Validators.max(100)]], // On the chain, the remaining balance is inferred as the composition side shares 

      playing_reward: [5, [Validators.required, Validators.min(1), Validators.max(100)]],

      tempAlbumArtists: this._fb.group({
        artist: [''],
        aliases: [[]],
        ISNI: [''],
      }),

      tempTrackArtists: this._fb.group({
        artist: [''],
        aliases: [[]],
        ISNI: [''],
      }),

      tempPublishers: this._fb.group({
        publisher: [''],
        IPI_CAE: [''],
        ISNI: ['']
      }),

      tempWriters: this._fb.group({
        writer: [''],
        IPI_CAE: [''],
        ISNI: [''],
        role: [Enums.WritersRole.Default],
        publisher: ['']
      }),

      tempDistributions: this._fb.group({
        payee: [''],
        bp: ['', [Validators.min(0), Validators.max(100)]]
      }),

      tempManagement: this._fb.group({
        voter: [''],
        percentage: ['', [Validators.min(0), Validators.max(100)]]
      }),

      tempDistributionsComp: this._fb.group({
        payee: [''],
        bp: ['', [Validators.min(0), Validators.max(100)]]
      }),

      tempManagementComp: this._fb.group({
        voter: [''],
        percentage: ['', [Validators.min(0), Validators.max(100)]]
      }),
    });
  }

  onFormValuesChanged() {
    for (const field in this.formErrors) {
      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }
      this.formErrors[field] = {};
      const control = this.contentForm.get(field);
      if (control && control.dirty && !control.valid) {
        this.formErrors[field] = control.errors;
      }
    }
  }

  onGeneralSplitsChange() {
    this.contentForm.get('master_share').valueChanges.subscribe(val => {
      this.mastValue = val;
      this.contentForm.value.master_share = val;
      this.syncGeneralSplits('master_share');
    });

    this.contentForm.get('publishers_share').valueChanges.subscribe(val => {
      this.compValue = val;
      this.contentForm.value.publishers_share = val;
      this.syncGeneralSplits('publishers_share');
    });

    this.contentForm.get('playing_reward').valueChanges.subscribe(val => {
      this.streamValue = val;
      this.contentForm.value.playing_reward = val;
      this.syncGeneralSplits('playing_reward');
    });
  }

  updateMasterManagesContract() {
    if (!this.masterManagesContract) {
      this.masterManagesContract = true;
    }
    else {
      this.masterManagesContract = false;
      this.masterRoyaltyInput.weight = null;
    }
  }

  updateCompManagesContract() {
    if (!this.compManagesContract) {
      this.compManagesContract = true;
    }
    else {
      this.compManagesContract = false;
      this.compRoyaltyInput.weight = null;
    }
  }

  showMasterThreshold() {
    if (this.managementList.length > 1) {
      return true;
    }
    else {
      return false;
    }
  }

  showCompThreshold() {
    if (this.managementCompList.length > 1) {
      return true;
    }
    else {
      return false;
    }
  }

  getGeneralSplitsFormValues() {
    this.mastValue = this.contentForm.value.master_share;
    this.compValue = this.contentForm.value.publishers_share;
    this.streamValue = this.contentForm.value.playing_reward;
  }

  syncGeneralSplits(splitType?) {
    this.mastMin = 0;
    this.compMin = 0;
    this.streamMin = 1;
    this.validateGenSplitTotal();
    this.validateCompRoyaltyRequired();

    this.mastMax = (this.max - (this.compValue + this.streamValue));
    this.compMax = (this.max - (this.mastValue + this.streamValue));
    this.streamMax = (this.max - (this.mastValue + this.compValue));
    this.total = this.mastValue + this.streamValue + this.compValue;
  }

  oneOwner() {
    if (!this.isOneOwner) {
      this.removeFromList('masterRoyaltyList', 0);
      this.contentForm.patchValue({ master_share: 95 });
      this.contentForm.patchValue({ playing_reward: 5 });
      this.contentForm.patchValue({ publishers_share: 0 });
      this.masterRoyaltyInput.muserName = this.muserName;
      this.masterManagesContract = true;
      this.masterRoyaltyInput.weight = 100;
      this.masterRoyaltyInput.income = 100;
      this.addRoyaltySplitList('masterRoyaltyList');
      this.isOneOwner = true;
    } else {
      this.isOneOwner = false;
      this.masterRoyaltyInput.muserName = '';
      this.masterManagesContract = false;
      this.masterRoyaltyInput.weight = null;
      this.masterRoyaltyInput.income = null;
      this.removeFromList('masterRoyaltyList', 0);
    }
  }

  addRoyaltySplitList(listName) {
    switch (listName) {
      case 'masterRoyaltyList':
        this.museService.muserExist(this.masterRoyaltyInput.muserName).then(
          muser => {
            if (this.isOneOwner === true) {
              muser = true;
            }
            if (muser === true) {
              if (this.masterRoyaltyInput.income !== null || this.masterRoyaltyInput.income !== undefined) {
                this.masterIncomeTotal = this.masterIncomeTotal + this.masterRoyaltyInput.income;
              }
              if (this.masterRoyaltyInput.weight !== null || this.masterRoyaltyInput.weight !== undefined) {
                this.masterWeightTotal = this.masterWeightTotal + this.masterRoyaltyInput.weight;
              }

              const normDistBp = this.normalizeSplitVal(this.masterRoyaltyInput.income);
              // const normDistWeight = this.normalizeSplitVal(this.masterRoyaltyInput.weight);
              let managementValue = '';

              if (this.masterManagesContract === true) {
                managementValue = 'Contract Manager';
              } else {
                this.masterRoyaltyInput.weight = null;
              }

              this.masterRoyaltyList.push({
                muserName: this.masterRoyaltyInput.muserName,
                income: this.masterRoyaltyInput.income,
                management: managementValue,
                weight: this.masterRoyaltyInput.weight
              });

              this.distributionsList.push({
                payee: this.masterRoyaltyInput.muserName,
                // bp: this.masterRoyaltyInput.income
                bp: normDistBp
              });

              if (this.masterManagesContract === true) {
                this.managementList.push({
                  voter: this.masterRoyaltyInput.muserName,
                  percentage: this.masterRoyaltyInput.weight
                  // percentage: normDistWeight
                });
                if (this.masterRoyaltyInput.weight < 100) {
                  this.showMasterThreshold();
                }
              }
              this.masterRoyaltyInput.muserName = null;
              this.masterRoyaltyInput.income = null;
              this.masterRoyaltyInput.management = null;
              this.masterRoyaltyInput.weight = null;
            }
            else {
              this.alert.showErrorMessage(ErrorCodes.muserNameNotFound);
            }
          });
        break;
      case 'compRoyaltyList':
        this.museService.muserExist(this.compRoyaltyInput.muserName).then(
          muser => {
            if (muser === true) {
              if (this.compRoyaltyInput.income !== null || this.compRoyaltyInput.income !== undefined) {

                this.compIncomeTotal = this.compIncomeTotal + this.compRoyaltyInput.income;
              }
              if (this.compRoyaltyInput.weight !== null || this.compRoyaltyInput.weight !== undefined) {

                this.compWeightTotal = this.compWeightTotal + this.compRoyaltyInput.weight;
              }

              const normDistCompBp = this.normalizeSplitVal(this.compRoyaltyInput.income);
              // const normDistCompWeight = this.normalizeSplitVal(this.compRoyaltyInput.weight);

              let managementCompValue = '';

              if (this.compManagesContract === true) {
                managementCompValue = 'Contract Manager';
              } else {
                this.compRoyaltyInput.weight = null;
              }

              this.compRoyaltyList.push({
                muserName: this.compRoyaltyInput.muserName,
                income: this.compRoyaltyInput.income,
                management: managementCompValue,
                weight: this.compRoyaltyInput.weight
              });

              this.distributionsCompList.push({
                payee: this.compRoyaltyInput.muserName,
                // bp: this.compRoyaltyInput.income
                bp: normDistCompBp
              });

              if (this.compManagesContract === true) {
                this.managementCompList.push({
                  voter: this.compRoyaltyInput.muserName,
                  percentage: this.compRoyaltyInput.weight
                  // percentage: normDistCompWeight
                });
                if (this.compRoyaltyInput.weight < 100) {
                  this.showCompThreshold();
                }
              }
              this.compRoyaltyInput.muserName = null;
              this.compRoyaltyInput.income = null;
              this.compRoyaltyInput.management = null;
              this.compRoyaltyInput.weight = null;
              // this.compManagesContract = false;
            }
            else {
              this.alert.showErrorMessage(ErrorCodes.muserNameNotFound);
            }
          });
        break;
      // default:
    }
  }

  addPublisher() {
    this.dialogRefPublishers = this.dialog.open(ModalPublishersComponent, {
      disableClose: true,
      data: {
        btnStart: AlertBtnText.Cancel,
        btnEnd: AlertBtnText.Add
      }
    });
    this.dialogRefPublishers.afterClosed().subscribe(
      data => {
        if (data !== undefined) {
          this.publishersList.push({
            publisher: data.publisher,
            IPI_CAE: data.IPI_CAE,
            ISNI: data.ISNI
          });
        }
      });
  }

  addWriter() {
    this.dialogRefWriters = this.dialog.open(ModalWritersComponent, {
      disableClose: true,
      data: {
        btnStart: AlertBtnText.Cancel,
        btnEnd: AlertBtnText.Add
      }
    });
    this.dialogRefWriters.afterClosed().subscribe(
      data => {
        if (data !== undefined) {
          this.writersList.push({
            writer: data.writer,
            IPI_CAE: data.IPI_CAE,
            ISNI: data.ISNI,
            publisher: data.publisher,
            role: data.role
          });
        }
      });

  }

  addArtist(headerTxt) {
    this.dialogRefArtist = this.dialog.open(ModalArtistComponent, {
      disableClose: true,
      data: {
        header: headerTxt,
        btnStart: AlertBtnText.Cancel,
        btnEnd: AlertBtnText.Add
      }
    });
    this.dialogRefArtist.afterClosed().subscribe(
      data => {
        if (data !== undefined) {
          switch (headerTxt) {
            case 'Track Artist':
              this.trackArtistList.push({
                artist: data.artist,
                isni: data.isni,
                aliases: data.aliases
              });
              break;
            case 'Album Artist':
              this.albumArtistList.push({
                artist: data.artist,
                isni: data.isni,
                aliases: data.aliases
              });
              break;
          }
        }
      });
  }

  removeFromList(listName: string, i) {
    switch (listName) {
      case 'masterRoyaltyList':
        let masterIncome = 0;
        let masterWeight = 0;
        this.masterRoyaltyList.slice(i, i + 1).map((v) => {
          Object.assign(v, v);
          masterIncome = v.income;
          masterWeight = v.weight;
        });

        this.masterRoyaltyList.splice(i, 1);
        this.distributionsList.splice(i, 1);
        this.managementList.splice(i, 1);

        this.masterIncomeTotal = this.masterIncomeTotal - masterIncome;
        this.masterWeightTotal = this.masterWeightTotal - masterWeight;
        break;
      case 'compRoyaltyList':
        let compIncome = 0;
        let compWeight = 0;
        this.compRoyaltyList.slice(i, i + 1).map((v) => {
          Object.assign(v, v);
          compIncome = v.income;
          compWeight = v.weight;
        });

        this.compRoyaltyList.splice(i, 1);
        this.distributionsCompList.splice(i, 1);
        this.managementCompList.splice(i, 1);

        this.compIncomeTotal = this.compIncomeTotal - compIncome;
        this.compWeightTotal = this.compWeightTotal - compWeight;
        break;
      default:
        this[listName].splice(i, 1);
    }
  }

  setCountry(country) {
    this.contentForm.get('album_meta').patchValue({ countryOrigin: country });
  }

  mapGenre(selectorParam: string, genre: number) {
    switch (selectorParam) {
      case 'albumGenre1':
        this.contentForm.get('album_meta').patchValue({ albumGenre1: genre });
        break;
      case 'albumGenre2':
        this.contentForm.get('album_meta').patchValue({ albumGenre2: genre });
        break;
      case 'trackGenre1':
        this.contentForm.get('track_meta').patchValue({ trackGenre1: genre });
        break;
      case 'trackGenre2':
        this.contentForm.get('track_meta').patchValue({ trackGenre2: genre });
        break;
    }
  }

  currentDate() {
    const today = new Date();
    this.maxDate = new Date(this.datePipe.transform(today, 'yyyy/MM/dd'));
    this.maxYear = Number.parseInt(this.datePipe.transform(today, 'yyyy'));
  }

  normalizeSplitVal(num: number) {
    return (num * 100);
  }

  customValidation() {
    this.validateGenSplitTotal();
    if (this.distributionsList.length === 0 || this.trackArtistList.length === 0 || this.writersList.length === 0 || !this.genSplitTotal ||
      this.masterIncomeTotal !== 100 || this.masterWeightTotal !== 100 || (this.compRoyaltyRequired && this.distributionsCompList.length === 0) ||
      (this.compRoyaltyRequired && (this.compIncomeTotal !== 100 || this.compWeightTotal !== 100))) {
      return false;
    }
    else {
      return true;
    }
  }

  validateGenSplitTotal() {
    if (this.total === this.max) {
      this.genSplitTotal = true;
    } else {
      this.genSplitTotal = false;
    }
  }

  validateCompRoyaltyRequired() {
    if (this.compValue === 0) {
      this.compRoyaltyList = [];
      this.distributionsCompList = [];
      this.managementCompList = [];
      this.compIncomeTotal = 0;
      this.compWeightTotal = 0;
      this.compRoyaltyRequired = false;
    }
    else {
      this.compRoyaltyRequired = true;
    }
  }

  mastInputValid() {
    if (this.masterRoyaltyInput.muserName === null || this.masterRoyaltyInput.muserName === '' || this.masterRoyaltyInput.income < 0 || this.masterRoyaltyInput.income > 100 || this.masterRoyaltyInput.income === null ||
      this.masterRoyaltyInput.weight < 0 || this.masterRoyaltyInput.weight > 100 || this.contentForm.get('management_threshold').value === null || (this.masterManagesContract === true && this.masterRoyaltyInput.weight === null)) {
      return false;
    }
    return true;
  }

  compInputValid() {
    if (this.compRoyaltyInput.muserName === null || this.compRoyaltyInput.muserName === '' || this.compRoyaltyInput.income < 0 || this.compRoyaltyInput.income > 100 || this.compRoyaltyInput.income === null ||
      this.compRoyaltyInput.weight < 0 || this.compRoyaltyInput.weight > 100 || this.contentForm.get('management_threshold_comp').value === null || (this.compManagesContract === true && this.compRoyaltyInput.weight === null)) {
      return false;
    }
    return true;
  }
 
  reviewContent() {
    // this.prepData();
    this.dialogRefReview = this.dialog.open(ModalReviewComponent, {
      width: '60%',
      disableClose: true,

      data: [this.contentForm.getRawValue(), this.trackArtistList, this.albumArtistList, this.writersList, this.publishersList,
      this.masterRoyaltyList, this.compRoyaltyList]


      // btnStart: AlertBtnText.Cancel,
      // btnEnd: AlertBtnText.Add
    });

    this.dialogRefReview.afterClosed().subscribe(data => {

      if (data !== undefined) {
        // this.ui.showLoading();
        this.prepData().then((results) => {
          if (results === true) {
            const authPassword = this.auth.user.getPassword();
            this.museService.postContent(authPassword, this.muserName, data).then((success) => {
              if (success === true) {
                this.contentForm.reset();
                this.ngOnInit();
              }
            }).catch((err) => {
              this.alert.showErrorMessage('Failed to Post Content - Error: ' + err);
            });
          }
          // this.ui.hideLoading();
        });
      }
      // this.ui.showLoading();
      // this.dataService.postContent(authPassword, this.muserName, data).then(() => {
      //   // TODO: the reset needs to go somewhere after post is successful
      //   // this.contentForm.reset();
      //   // this.ngOnInit();
      //   // this.ui.hideLoading();
      // }).catch((err) => {
      //   this.alert.showErrorMessage('Failed to Post Content - Error: ' + err);
      // });
      // this.ui.hideLoading();
    });

  }

  prepData() { // TODO: Double check all values are correct!!!
    this.ui.showLoading();
    // alert('compValue: ' + this.compValue);
    return new Promise((resolve, reject) => {
      const isValid = this.customValidation();
      if (isValid) {

        const num_salesStartDate = Number.parseInt(this.datePipe.transform(this.contentForm.value.album_meta.salesStartDate, 'yyyyMMdd'));
        this.contentForm.get('album_meta').patchValue({ salesStartDate: num_salesStartDate });

        const num_releaseDate = Number.parseInt(this.datePipe.transform(this.contentForm.value.album_meta.releaseDate, 'yyyyMMdd'));
        this.contentForm.get('album_meta').patchValue({ releaseDate: num_releaseDate });

        const releaseYear = num_releaseDate.toString().substring(0, 4);
        const num_releaseYear = Number.parseInt(releaseYear);
        this.contentForm.get('album_meta').patchValue({ releaseYear: num_releaseYear });

        const normPubShar = this.normalizeSplitVal(this.contentForm.value.publishers_share);
        const normPlayReward = this.normalizeSplitVal(this.contentForm.value.playing_reward);

        this.contentForm.patchValue({ publishers_share: normPubShar });
        this.contentForm.patchValue({ playing_reward: normPlayReward });

        if (this.contentForm.value.album_meta.albumTitle === '') {
          this.contentForm.get('album_meta').patchValue({ albumTitle: this.contentForm.value.track_meta.trackTitle });
        }

        if (this.publishersList.length === 0) {
          this.contentForm.get('comp_meta.publishers').patchValue({
            publisher: ' '
          });
        } else {
          this.contentForm.get('comp_meta.publishers').patchValue({
            publisher: this.publishersList
          });
        }

        if (this.managementList.length === 1) {
          this.contentForm.patchValue({
            management_threshold: 100
          });
        }

        if (this.managementCompList.length === 1) {
          this.contentForm.patchValue({
            management_threshold_comp: 100,
          });
        }

        if (this.compValue === 0) {
          this.contentForm.get('comp_meta').patchValue({
            isThirdPartyPublishers: false
          });
        } else {
          this.contentForm.get('comp_meta').patchValue({
            isThirdPartyPublishers: true
          });
        }

        // console.log('albumArtists List: ' + this.albumArtistList);
        // console.log('trackArtists List: ' + this.trackArtistList);
        // console.log('publishers List: ' + this.publishersList);
        // console.log('writers List: ' + this.writersList);

        this.contentForm.get('album_meta').patchValue({ albumArtists: this.albumArtistList });
        this.contentForm.get('track_meta').patchValue({ trackArtists: this.trackArtistList });
        this.contentForm.get('comp_meta').patchValue({ publishers: this.publishersList, writers: this.writersList });

        // console.log('albumArtists: ' + this.contentForm.get('album_meta'));
        // console.log('trackArtists: ' + this.contentForm.get('track_meta'));
        // console.log('publishers: ' + this.contentForm.get('comp_meta.publishers'));
        // console.log('writers: ' + this.contentForm.get('comp_meta.writers'));

        this.contentForm.patchValue({
          distributions: this.distributionsList,
          distributionsComp: this.distributionsCompList,
          management: this.managementList,
          managementComp: this.managementCompList
        });

        this.ui.hideLoading();
        resolve(true);
      } else {
        this.ui.hideLoading();
        this.alert.showErrorMessage(ErrorCodes.invalidContentForm);
        reject(false);
      }
      // this.ui.hideLoading();
    });
    // this.ui.hideLoading();
  }

   // endregion
}
