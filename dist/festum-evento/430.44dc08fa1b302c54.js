"use strict";(self.webpackChunkfestum_evento=self.webpackChunkfestum_evento||[]).push([[430],{1430:(ot,h,a)=>{a.r(h),a.d(h,{PromoteModule:()=>et});var p=a(6895),f=a(6188),m=a(1971),r=a(4006),x=a(3144),d=a(7489),t=a(4650),v=a(5922),c=a(2340),T=a(529),_=a(3053);let Z=(()=>{class i{constructor(e,o){this.http=e,this._globalFunctions=o}getNotificationById(e){return this.http.post(c.N.appURL+"organizer/notification/getone",{notificationid:e},this._globalFunctions.getAuthorizationHeader())}saveUserType(e){return this.http.post(c.N.appURL+"organizer/notification/selectusertype",e,this._globalFunctions.getAuthorizationHeader())}saveUsers(e){return this.http.post(c.N.appURL+"organizer/notification/selectusers",e,this._globalFunctions.getAuthorizationHeader())}saveSchedule(e){return this.http.post(c.N.appURL+"organizer/notification/setschedule",e,this._globalFunctions.getAuthorizationHeader())}getImportedUsersList(e){return this.http.post(c.N.appURL+"organizer/notification/userlist",e,this._globalFunctions.getAuthorizationHeader())}checkAllUser(e){return this.http.post(c.N.appURL+"organizer/notification/checkalluser",e,this._globalFunctions.getAuthorizationHeader())}checkUser(e){return this.http.post(c.N.appURL+"organizer/notification/checkuser",e,this._globalFunctions.getAuthorizationHeader())}getCouponsList(){return this.http.get(c.N.appURL+"organizer/notificationcoupons/list",this._globalFunctions.getAuthorizationHeader())}getSettings(e=""){return this.http.get(c.N.appURL+"organizer/notification/setting?notificationid="+e,this._globalFunctions.getAuthorizationHeader())}importUsersCSV(e){return this.http.post(c.N.appURL+"organizer/notification/import",e,this._globalFunctions.getFileAuthorizationHeader())}getPromotionPlans(){return this.http.get(c.N.appURL+"organizer/promotionplan/list",this._globalFunctions.getAuthorizationHeader())}processPayment(e={}){return this.http.post(c.N.appURL+"organizer/notification/paynow",e,this._globalFunctions.getAuthorizationHeader())}}return i.\u0275fac=function(e){return new(e||i)(t.LFG(T.eN),t.LFG(_.E))},i.\u0275prov=t.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})();var U=a(7465),b=a(7932);const O=["form"];function C(i,n){if(1&i){const e=t.EpF();t.TgZ(0,"div",25)(1,"label",26)(2,"input",27),t.NdJ("change",function(){const l=t.CHM(e).$implicit,u=t.oxw();return t.KtG(u.getTotalUsers(null==l?null:l.value))}),t.qZA(),t._UZ(3,"span",28),t.TgZ(4,"div",29),t._UZ(5,"img",30),t.qZA(),t.TgZ(6,"p",31),t._uU(7),t.qZA()()()}if(2&i){const e=n.$implicit;t.xp6(1),t.Q6J("id",null==e?null:e.value),t.xp6(1),t.Q6J("formControlName","usertype")("id",null==e?null:e.value)("value",null==e?null:e.value),t.xp6(3),t.Q6J("src",null==e?null:e.url,t.LSH)("alt",null==e?null:e.type),t.xp6(2),t.Oqu(null==e?null:e.type)}}function A(i,n){if(1&i&&(t.TgZ(0,"option",37),t._uU(1),t.qZA()),2&i){const e=n.index,o=t.oxw(2);t.Q6J("value",e?e*o.usersSelectionLimit:o.totalUsersCount),t.xp6(1),t.Oqu(e?e*o.usersSelectionLimit:"Select All")}}function j(i,n){if(1&i&&(t.ynx(0),t.TgZ(1,"div",32)(2,"span",12),t._uU(3,"Select User"),t.qZA(),t.TgZ(4,"select",33),t.YNc(5,A,2,2,"option",34),t.qZA()(),t.TgZ(6,"div",32)(7,"span",12),t._uU(8,"Total User"),t.qZA(),t.TgZ(9,"div",35)(10,"span",36),t._uU(11),t.qZA()()(),t.BQk()),2&i){const e=t.oxw();t.xp6(4),t.Q6J("formControlName","numberofusers"),t.xp6(1),t.Q6J("ngForOf",e.totalOptions),t.xp6(6),t.Oqu(e.totalUsers)}}function y(i,n){if(1&i){const e=t.EpF();t.TgZ(0,"div",54)(1,"div")(2,"div",55),t._UZ(3,"img",56),t.qZA(),t.TgZ(4,"label",57)(5,"div",58)(6,"div",59)(7,"input",60),t.NdJ("click",function(){t.CHM(e);const s=t.oxw(2);return t.KtG(s.onPromotionPlanClick())}),t.qZA(),t._UZ(8,"i",61),t.qZA(),t.TgZ(9,"span",62),t._uU(10),t.qZA()(),t.TgZ(11,"div",63)(12,"div",64)(13,"span",65),t._uU(14,"Notification"),t.qZA(),t.TgZ(15,"span",65),t._uU(16),t.ALo(17,"number"),t.ALo(18,"number"),t.qZA()(),t.TgZ(19,"div",64)(20,"span",65),t._uU(21,"SMS"),t.qZA(),t.TgZ(22,"span",65),t._uU(23),t.ALo(24,"number"),t.ALo(25,"number"),t.qZA()(),t.TgZ(26,"div",64)(27,"span",65),t._uU(28,"Email"),t.qZA(),t.TgZ(29,"span",65),t._uU(30),t.ALo(31,"number"),t.ALo(32,"number"),t.qZA()(),t.TgZ(33,"div",64)(34,"span",65),t._uU(35,"All"),t.qZA(),t.TgZ(36,"span",65),t._uU(37),t.ALo(38,"number"),t.ALo(39,"number"),t.qZA()()()()()()}if(2&i){const e=n.$implicit,o=n.index;t.xp6(1),t.Gre("bg-gradient-to-r ",o?1==o?"from-[#20c0e878] to-[#20C0E8]":"from-[#faba1585] to-[#FABA15]":"from-[#13e1b094] to-[#13E1B0]"," p-5 rounded-xl relative overflow-hidden cursor-pointer"),t.xp6(3),t.Q6J("for","promotion-plan"+o),t.xp6(3),t.Q6J("id","promotion-plan"+o)("value",e._id)("formControlName","selected_plan"),t.xp6(3),t.Oqu(e.planname),t.xp6(6),t.AsE("",t.xi3(17,16,e.notification_amount,"1.2-2")," FOR ",t.xi3(18,19,e.total_users,"1.0-0")," USERS"),t.xp6(7),t.AsE("",t.xi3(24,22,e.sms_amount,"1.2-2")," FOR ",t.xi3(25,25,e.total_users,"1.0-0")," USERS"),t.xp6(7),t.AsE("",t.xi3(31,28,e.email_amount,"1.2-2")," FOR ",t.xi3(32,31,e.total_users,"1.0-0")," USERS"),t.xp6(7),t.AsE("",t.xi3(38,34,e.combo_amount,"1.2-2")," FOR ",t.xi3(39,37,e.total_users,"1.0-0")," USERS")}}function w(i,n){if(1&i&&(t.TgZ(0,"option",37),t._uU(1),t.qZA()),2&i){const e=n.index,o=t.oxw(2);t.Q6J("value",e?e*o.usersSelectionLimit:o.totalUsersCount),t.xp6(1),t.Oqu(e?e*o.usersSelectionLimit:"Select All")}}function P(i,n){if(1&i){const e=t.EpF();t.TgZ(0,"div",38)(1,"div",39)(2,"span",12),t._uU(3,"Select User Plan"),t.qZA(),t.TgZ(4,"div",40),t.YNc(5,y,40,40,"div",41),t.qZA()(),t.TgZ(6,"h2",42)(7,"small",43),t._uU(8,"OR"),t.qZA()(),t.TgZ(9,"div")(10,"div",44)(11,"div",45)(12,"span",46),t._uU(13,"Select All App User"),t.qZA(),t.TgZ(14,"select",47),t.NdJ("change",function(){t.CHM(e);const s=t.oxw();return t.KtG(s.onChangeUserSelection())}),t.YNc(15,w,2,2,"option",34),t.qZA()(),t.TgZ(16,"div",48)(17,"span",36),t._uU(18),t.qZA()()(),t.TgZ(19,"div",49)(20,"div",45)(21,"span",46),t._uU(22,"ads publish location"),t.qZA(),t.TgZ(23,"div",50),t._UZ(24,"input",51),t.TgZ(25,"a",52),t._UZ(26,"i",53),t.qZA()()()()()()}if(2&i){const e=t.oxw();t.xp6(5),t.Q6J("ngForOf",e.allPromotionPlans),t.xp6(9),t.Q6J("formControlName","numberofusers"),t.xp6(1),t.Q6J("ngForOf",e.totalOptions),t.xp6(3),t.hij("Total User : ",e.totalUsers,""),t.xp6(6),t.Q6J("formControlName","published_location")}}const L=function(){return{width:"50px",height:"50px"}};function F(i,n){1&i&&t._UZ(0,"p-progressSpinner",87),2&i&&t.Akn(t.DdM(2,L))}function I(i,n){if(1&i){const e=t.EpF();t.TgZ(0,"div",88)(1,"label",89)(2,"input",90),t.NdJ("change",function(){const s=t.CHM(e),l=s.$implicit,u=s.index,g=t.oxw(2);return t.KtG(g.onCheckboxChange(l,u))}),t.qZA(),t._UZ(3,"i",73),t.qZA(),t.TgZ(4,"div",91)(5,"div",92),t._UZ(6,"img",93),t.qZA(),t.TgZ(7,"span",94),t._uU(8),t.qZA()()()}if(2&i){const e=n.$implicit,o=n.index,s=t.oxw(2);t.xp6(2),t.Q6J("id","user-"+o)("checked",e.selected),t.xp6(4),t.Q6J("src",e.Photo&&""!=e.Photo?e.Photo:s.constants.defaultImage,t.LSH)("alt",null==e?null:e.FullName),t.xp6(2),t.Oqu(null==e?null:e.FullName)}}function S(i,n){if(1&i){const e=t.EpF();t.TgZ(0,"div",95)(1,"button",96),t.NdJ("click",function(){t.CHM(e);const s=t.oxw(2);return t.KtG(s.getImportedUsersList())}),t._uU(2,"Load more"),t.qZA()()}}function N(i,n){if(1&i){const e=t.EpF();t.TgZ(0,"div",38)(1,"span",12),t._uU(2,"Select User"),t.qZA(),t.TgZ(3,"div",66)(4,"div",67)(5,"div",68),t.YNc(6,F,1,3,"p-progressSpinner",69),t.TgZ(7,"div",70)(8,"label",71)(9,"input",72),t.NdJ("click",function(s){t.CHM(e);const l=t.oxw();return t.KtG(l.onSelectAllChecked(s))}),t.qZA(),t._UZ(10,"i",73),t.qZA(),t.TgZ(11,"span",74),t._uU(12,"Select All"),t.qZA()(),t.YNc(13,I,9,5,"div",75),t.YNc(14,S,3,0,"div",76),t.qZA()(),t.TgZ(15,"div",77)(16,"div",78),t._uU(17,"Total User: "),t.TgZ(18,"span"),t._uU(19),t.ALo(20,"number"),t.qZA()()()(),t.TgZ(21,"div",79)(22,"div",80)(23,"span",12),t._uU(24,"Upload Excel"),t.qZA(),t.TgZ(25,"a",81),t._uU(26,"Download Demo"),t.qZA()(),t.TgZ(27,"label",82)(28,"input",83),t.NdJ("change",function(s){t.CHM(e);const l=t.oxw();return t.KtG(l.uploadUserCSV(s))}),t.qZA(),t.TgZ(29,"div",84),t._UZ(30,"i",85),t.TgZ(31,"span",86),t._uU(32,"Upload Excel"),t.qZA()()()()()}if(2&i){const e=t.oxw();t.xp6(6),t.Q6J("ngIf",e.isLoading),t.xp6(3),t.Q6J("formControlName","is_selected_all"),t.xp6(4),t.Q6J("ngForOf",e.allImportedUsers),t.xp6(1),t.Q6J("ngIf",e.pageObj&&e.pageObj.hasNextPage),t.xp6(5),t.Oqu(t.xi3(20,6,e.totalUsers,"1.0-0")),t.xp6(6),t.Q6J("href",e.constants.baseImageURL+e.constants.importUsersDemoUrl,t.LSH)}}function q(i,n){if(1&i&&(t.TgZ(0,"span",103),t._uU(1),t.qZA()),2&i){const e=t.oxw(2);t.xp6(1),t.AsE("",e.numberOfUsers," User x ",null==e.settingObj?null:e.settingObj.notificationcost,"")}}function J(i,n){if(1&i&&(t.TgZ(0,"span",103),t._uU(1),t.ALo(2,"number"),t.ALo(3,"number"),t.qZA()),2&i){const e=t.oxw(2);t.xp6(1),t.AsE("",t.xi3(2,2,e.selectedPlanObj.notification_amount,"1.2-2")," FOR ",t.xi3(3,5,e.selectedPlanObj.total_users,"1.0-0")," USERS")}}function k(i,n){if(1&i&&(t.TgZ(0,"div",97),t._UZ(1,"i",98),t.TgZ(2,"div",99)(3,"div",39)(4,"p",94),t._uU(5,"Notification"),t.qZA(),t.YNc(6,q,2,2,"span",100),t.YNc(7,J,4,8,"span",100),t.qZA(),t.TgZ(8,"h4",101),t._UZ(9,"i",102),t._uU(10),t.ALo(11,"number"),t.qZA()()()),2&i){const e=t.oxw();t.xp6(6),t.Q6J("ngIf",e.calculateTotalObj.planDiscount),t.xp6(1),t.Q6J("ngIf",!e.calculateTotalObj.planDiscount),t.xp6(3),t.Oqu(t.xi3(11,3,(null==e.calculateTotalObj?null:e.calculateTotalObj.notificationTotal)||0,"1.2-2"))}}function H(i,n){if(1&i&&(t.TgZ(0,"span",103),t._uU(1),t.qZA()),2&i){const e=t.oxw(2);t.xp6(1),t.AsE("",e.numberOfUsers," Phone Number x ",null==e.settingObj?null:e.settingObj.smscost,"")}}function D(i,n){if(1&i&&(t.TgZ(0,"span",103),t._uU(1),t.ALo(2,"number"),t.ALo(3,"number"),t.qZA()),2&i){const e=t.oxw(2);t.xp6(1),t.AsE("",t.xi3(2,2,e.selectedPlanObj.sms_amount,"1.2-2")," FOR ",t.xi3(3,5,e.selectedPlanObj.total_users,"1.0-0")," USERS")}}function E(i,n){if(1&i&&(t.TgZ(0,"div",97),t._UZ(1,"i",104),t.TgZ(2,"div",99)(3,"div",39)(4,"p",94),t._uU(5,"SMS"),t.qZA(),t.YNc(6,H,2,2,"span",100),t.YNc(7,D,4,8,"span",100),t.qZA(),t.TgZ(8,"h4",101),t._UZ(9,"i",102),t._uU(10),t.ALo(11,"number"),t.qZA()()()),2&i){const e=t.oxw();t.xp6(6),t.Q6J("ngIf",e.calculateTotalObj.planDiscount),t.xp6(1),t.Q6J("ngIf",!e.calculateTotalObj.planDiscount),t.xp6(3),t.Oqu(t.xi3(11,3,(null==e.calculateTotalObj?null:e.calculateTotalObj.smsTotal)||0,"1.2-2"))}}function Q(i,n){if(1&i&&(t.TgZ(0,"span",103),t._uU(1),t.qZA()),2&i){const e=t.oxw(2);t.xp6(1),t.AsE("",e.numberOfUsers," Email ID x ",null==e.settingObj?null:e.settingObj.emailcost,"")}}function R(i,n){if(1&i&&(t.TgZ(0,"span",103),t._uU(1),t.ALo(2,"number"),t.ALo(3,"number"),t.qZA()),2&i){const e=t.oxw(2);t.xp6(1),t.AsE("",t.xi3(2,2,e.selectedPlanObj.email_amount,"1.2-2")," FOR ",t.xi3(3,5,e.selectedPlanObj.total_users,"1.0-0")," USERS")}}function z(i,n){if(1&i&&(t.TgZ(0,"div",97),t._UZ(1,"i",105),t.TgZ(2,"div",99)(3,"div",39)(4,"p",94),t._uU(5,"Email"),t.qZA(),t.YNc(6,Q,2,2,"span",100),t.YNc(7,R,4,8,"span",100),t.qZA(),t.TgZ(8,"h4",101),t._UZ(9,"i",102),t._uU(10),t.ALo(11,"number"),t.qZA()()()),2&i){const e=t.oxw();t.xp6(6),t.Q6J("ngIf",e.calculateTotalObj.planDiscount),t.xp6(1),t.Q6J("ngIf",!e.calculateTotalObj.planDiscount),t.xp6(3),t.Oqu(t.xi3(11,3,(null==e.calculateTotalObj?null:e.calculateTotalObj.emailTotal)||0,"1.2-2"))}}function Y(i,n){if(1&i&&(t.TgZ(0,"div",97),t._UZ(1,"i",105),t.TgZ(2,"div",99)(3,"div",39)(4,"p",94),t._uU(5,"All"),t.qZA(),t.TgZ(6,"span",103),t._uU(7),t.ALo(8,"number"),t.ALo(9,"number"),t.qZA()(),t.TgZ(10,"h4",101),t._UZ(11,"i",102),t._uU(12),t.ALo(13,"number"),t.qZA()()()),2&i){const e=t.oxw();t.xp6(7),t.AsE("",t.xi3(8,3,e.selectedPlanObj.combo_amount,"1.2-2")," FOR ",t.xi3(9,6,e.selectedPlanObj.total_users,"1.0-0")," USERS"),t.xp6(5),t.Oqu(t.xi3(13,9,(null==e.selectedPlanObj?null:e.selectedPlanObj.combo_amount)||0,"1.2-2"))}}function G(i,n){if(1&i&&(t.TgZ(0,"div",106)(1,"h5"),t._uU(2,"discount savings"),t.qZA(),t.TgZ(3,"h4"),t._uU(4,"- "),t._UZ(5,"i",102),t._uU(6),t.ALo(7,"number"),t.qZA()()),2&i){const e=t.oxw();t.xp6(6),t.Oqu(t.xi3(7,1,(null==e.calculateTotalObj?null:e.calculateTotalObj.totalCouponDiscount)||0,"1.2-2"))}}function M(i,n){if(1&i){const e=t.EpF();t.TgZ(0,"div",111)(1,"div")(2,"h5",112),t._uU(3),t.ALo(4,"number"),t.qZA(),t.TgZ(5,"span",113),t._uU(6),t.qZA()(),t.TgZ(7,"div")(8,"a",114),t.NdJ("click",function(){t.CHM(e);const s=t.oxw(3);return t.KtG(s.onRemoveCoupon())}),t._UZ(9,"i",115),t.qZA()()()}if(2&i){const e=t.oxw(3);t.xp6(3),t.hij("Coupon applied - You saved \u20b9",t.xi3(4,2,(null==e.calculateTotalObj?null:e.calculateTotalObj.totalCouponDiscount)||0,"1.2-2"),""),t.xp6(3),t.hij("Coupon Code : ",null==e.selectedCoupon?null:e.selectedCoupon.code,"")}}function B(i,n){if(1&i){const e=t.EpF();t.TgZ(0,"div",116),t._UZ(1,"i",117),t.TgZ(2,"div",99)(3,"div",39)(4,"p",94),t._uU(5,"Apply Coupons"),t.qZA(),t._UZ(6,"span",118),t.qZA(),t.TgZ(7,"div",119)(8,"button",120),t.NdJ("click",function(){t.CHM(e);const s=t.oxw().$implicit,l=t.oxw(2);return t.KtG(l.onApplyCoupon(s))}),t._uU(9," Apply Code "),t.qZA()()()()}if(2&i){const e=t.oxw().$implicit;t.xp6(6),t.Q6J("innerHTML",(null==e?null:e.description)||"",t.oJD)}}function V(i,n){if(1&i&&(t.TgZ(0,"div"),t.YNc(1,M,10,5,"div",109),t.YNc(2,B,10,1,"div",110),t.qZA()),2&i){const e=n.$implicit,o=t.oxw(2);t.xp6(1),t.Q6J("ngIf",o.selectedCoupon&&o.selectedCoupon._id&&o.selectedCoupon._id==e._id),t.xp6(1),t.Q6J("ngIf",!o.selectedCoupon||!o.selectedCoupon._id||o.selectedCoupon._id!=e._id)}}function K(i,n){if(1&i&&(t.TgZ(0,"div",11)(1,"h5",107),t._uU(2,"discount coupon"),t.qZA(),t.YNc(3,V,3,2,"div",108),t.qZA()),2&i){const e=t.oxw();t.xp6(3),t.Q6J("ngForOf",e.couponsList)}}let $=(()=>{class i{constructor(e,o,s,l,u,g){this._formBuilder=e,this._sNotify=o,this._promoteService=s,this._router=l,this._globalFunctions=u,this._globalService=g,this.constants=x.t,this.notificationObj={},this.settingObj={},this.allPromotionPlans=[],this.allImportedUsers=[],this.isAllUserSelected=!1,this.isExistingUserSelected=!1,this.isUploadCSVLoading=!1,this.tmpSelectedPlan="",this.totalUsers=0,this.totalUsersCount=5999,this.usersSelectionLimit=500,this.calculateTotalObj={},this.selectedPlanObj={},this.couponsList=[],this.isCouponLoading=!1,this.selectedCoupon="",this.numberOfUsers=0,this.isLoading=!1,this.pageObj={}}ngOnInit(){this.nId=localStorage.getItem("nId"),this.nId&&""!=this.nId?(this._preparePromoteForm(),this.getNotificationById(),this.getCoupons(),this.getSettings(),this.getPromotionPlans()):this._router.navigate(["promotions"]),this.promoteForm.get("usertype").valueChanges.subscribe(e=>{console.log(e)})}get totalOptions(){return new Array(this.totalUsersCount?Math.ceil((this.totalUsersCount+1)/this.usersSelectionLimit):0)}getNotificationById(){this.isLoading=!0,this._promoteService.getNotificationById(this.nId).subscribe(e=>{e&&e.IsSuccess?(this._globalService.promoteNotification$.next(e.Data),this._preparePromoteForm(e.Data),this.getTotalUsers(e.Data.usertype),"existingusers"===e.Data.usertype&&this.getImportedUsersList()):this._globalFunctions.successErrorHandling(e,this,!0),this.isLoading=!1},e=>{this._globalFunctions.errorHanding(e,this,!0),this.isLoading=!1})}_preparePromoteForm(e={}){console.log(e),this.promoteForm=this._formBuilder.group({notificationid:[this.nId,[r.kI.required]],usertype:[e?.usertype||"",[r.kI.required]],numberofusers:[e?.numberofusers||""],published_location:[e?.published_location||""],selected_plan:[e?.selected_plan||""],is_selected_all:[e?.is_selected_all||!1]})}getTotalUsers(e){this._promoteService.saveUserType({notificationid:this.nId,usertype:e}).subscribe(s=>{if(s&&s.IsSuccess)if(console.log(s),"onlineofferusers"===e)this.totalUsers=s.Data.totalonlineofferusers;else if("eventusers"===e)this.totalUsers=s.Data.totaleventusers;else if("shopusers"===e)this.totalUsers=s.Data.totalshopusers;else if("livestreamusers"===e)this.totalUsers=s.Data.totallivestreamusers;else{if("allusers"!==e)return;this.totalUsers=s.Data.totalusers}else this._globalFunctions.successErrorHandling(s,this,!0)},s=>{this._globalFunctions.errorHanding(s,this,!0)})}getPromotionPlans(){this.isLoading=!0,this._promoteService.getPromotionPlans().subscribe(e=>{e&&e.IsSuccess?(this.allPromotionPlans=e.Data,this.isLoading=!1):(this._globalFunctions.successErrorHandling(e,this,!0),this.isLoading=!1)},e=>{this._globalFunctions.errorHanding(e,this,!0),this.isLoading=!1})}getImportedUsersList(){this.isLoading=!0,this._promoteService.getImportedUsersList({notificationid:this.nId,page:this.pageObj?.nextPage||1,limit:this.pageObj?.limit||6,search:""}).subscribe(o=>{o&&o.IsSuccess?(this.allImportedUsers=this.allImportedUsers&&this.allImportedUsers.length?d.concat(...this.allImportedUsers,o.Data.docs):this._globalFunctions.copyObject(o.Data.docs),this.pageObj=this._globalFunctions.copyObject(o.Data),this.totalUsers=this.pageObj.totalDocs,delete this.pageObj.docs,this.isLoading=!1):(this._globalFunctions.successErrorHandling(o,this,!0),this.isLoading=!1)},o=>{this._globalFunctions.errorHanding(o,this,!0),this.isLoading=!1})}uploadUserCSV(e){if(e.target.files&&e.target.files[0]){this.isUploadCSVLoading=!0;const o=e.target.files[0];if("text/csv"!=o.type&&"text/xml"!=o.type&&"text/xls"!=o.type&&"text/xlsx"!=o.type)return this._sNotify.error("File type is Invalid.","Oops!"),!1;const s=new FormData;s.append("file",o),s.append("notificationid",this.nId),this._promoteService.importUsersCSV(s).subscribe(l=>{l&&l.IsSuccess?(l.Data.rejectedCount&&l.Data.importCount>0&&this._sNotify.success(l.Data.importCount+" Number of user records uploaded successfully.","Success"),l.Data.rejectedCount&&l.Data.rejectedCount>0&&this._sNotify.error(l.Data.rejectedCount+" Number of user records rejected.","Oops"),this.pageObj={},this.allImportedUsers=[],this.getImportedUsersList(),this.isUploadCSVLoading=!1):(this._globalFunctions.successErrorHandling(l,this,!0),this.isUploadCSVLoading=!1)},l=>{this._globalFunctions.errorHanding(l,this,!0),this.isUploadCSVLoading=!1})}}onSelectAllChecked(e){if(this.allImportedUsers&&this.allImportedUsers.length){this.isLoading=!0;const o=e&&e.target&&e.target.checked;this._promoteService.checkAllUser({notificationid:this.nId,is_selected_all:o}).subscribe(l=>{l&&l.IsSuccess?(this.allImportedUsers=d.map(this.allImportedUsers,u=>({...u,selected:o})),e&&e.target&&e.target.checked?localStorage.setItem("selectAll","true"):localStorage.removeItem("selectAll"),this.isLoading=!1):(this._globalFunctions.successErrorHandling(l,this,!0),this.isLoading=!1)},l=>{this._globalFunctions.errorHanding(l,this,!0),this.isLoading=!1})}}onCheckboxChange(e,o){if(e&&e._id){this.isLoading=!0;const s={notificationid:this.nId,userid:e._id,selected:!e.selected};this._promoteService.checkUser(s).subscribe(l=>{if(l&&l.IsSuccess){const u=this._globalFunctions.copyObject(this.allImportedUsers);u[o].selected=!e.selected,this.allImportedUsers=this._globalFunctions.copyObject(u),s.selected||localStorage.removeItem("selectAll"),this.isLoading=!1}else this._globalFunctions.successErrorHandling(l,this,!0),this.isLoading=!1},l=>{this._globalFunctions.errorHanding(l,this,!0),this.isLoading=!1})}}onPromotionPlanClick(){setTimeout(()=>{},0)}onChangeUserSelection(){this.tmpSelectedPlan=""}getCoupons(){this.isCouponLoading=!0,this._promoteService.getCouponsList().subscribe(e=>{e&&e.IsSuccess?(this.couponsList=this._globalFunctions.copyObject(e.Data),this.isCouponLoading=!1):(this._globalFunctions.successErrorHandling(e,this,!0),this.isCouponLoading=!1)},e=>{this._globalFunctions.errorHanding(e,this,!0),this.isCouponLoading=!1})}getSettings(){this.isLoading=!0,this._promoteService.getSettings(this.nId).subscribe(e=>{e&&e.IsSuccess?(this.settingObj=this._globalFunctions.copyObject(e.Data?.settings[0]||{}),this.selectedPlanObj=this._globalFunctions.copyObject(e.Data?.planData||{}),this.numberOfUsers=e.Data.numberofusers,this.calculatePrice(),this.isLoading=!1):(this._globalFunctions.successErrorHandling(e,this,!0),this.isLoading=!1)},e=>{this._globalFunctions.errorHanding(e,this,!0),this.isLoading=!1})}calculatePrice(){const e=this.notificationObj&&this.notificationObj.is_notification,o=this.notificationObj&&this.notificationObj.is_sms,s=this.notificationObj&&this.notificationObj.is_email;if(this.calculateTotalObj.notificationTotal=e?Number(this.numberOfUsers)*Number(this.settingObj.notificationcost):0,this.calculateTotalObj.smsTotal=o?Number(this.numberOfUsers)*Number(this.settingObj.smscost):0,this.calculateTotalObj.emailTotal=s?Number(this.numberOfUsers)*Number(this.settingObj.emailcost):0,this.calculateTotalObj.subTotal=d.sum([this.calculateTotalObj.notificationTotal,this.calculateTotalObj.smsTotal,this.calculateTotalObj.emailTotal]),this.selectedPlanObj&&this.selectedPlanObj._id&&(this.calculateTotalObj.notificationTotal=e?this.selectedPlanObj.notification_amount:0,this.calculateTotalObj.smsTotal=o?this.selectedPlanObj.sms_amount:0,this.calculateTotalObj.emailTotal=s?this.selectedPlanObj.email_amount:0,this.calculateTotalObj.planDiscount=e&&o&&s,this.calculateTotalObj.subTotal=d.sum([this.calculateTotalObj.notificationTotal,this.calculateTotalObj.smsTotal,this.calculateTotalObj.emailTotal]),this.calculateTotalObj.planDiscount&&(this.calculateTotalObj.subTotal=this.selectedPlanObj.combo_amount)),this.calculateTotalObj.totalCouponDiscount=0,this.selectedCoupon&&this.selectedCoupon._id)if(this.selectedCoupon.amount)this.calculateTotalObj.totalCouponDiscount=this.selectedCoupon.amount<=this.calculateTotalObj.subTotal?this.selectedCoupon.amount:this.calculateTotalObj.subTotal;else if(this.selectedCoupon.percentage){const l=this.selectedCoupon.percentage*(this.calculateTotalObj.subTotal/100);this.calculateTotalObj.totalCouponDiscount=l<=this.calculateTotalObj.subTotal?l:this.calculateTotalObj.subTotal}this.calculateTotalObj.total=this.calculateTotalObj.subTotal-this.calculateTotalObj.totalCouponDiscount}onApplyCoupon(e={}){this.selectedCoupon=this._globalFunctions.copyObject(e),this.calculatePrice()}onRemoveCoupon(){this.selectedCoupon="",this.calculatePrice()}prepareCalculatedObj(){const e=this._globalFunctions.copyObject(this.calculateTotalObj||{}),o={};return o.notificationid=this._globalFunctions.copyObject(this.nId||""),o.notification_amt=e.notificationTotal,o.sms_amt=e.smsTotal,o.email_amt=e.emailTotal,o.discount_coupon=this.selectedCoupon?._id||"",o.total=e.total,o}payNow(){if(this.isLoading)return!1;const e=this.prepareCalculatedObj();this.isLoading=!0,this._promoteService.processPayment(e).subscribe(o=>{o&&o.IsSuccess?(this._sNotify.success("Payment Successfully.","Success"),this.isLoading=!1):(this._globalFunctions.successErrorHandling(o,this,!0),this.isLoading=!1)},o=>{this._globalFunctions.errorHanding(o,this,!0),this.isLoading=!1})}}return i.\u0275fac=function(e){return new(e||i)(t.Y36(r.qu),t.Y36(v.VZ),t.Y36(Z),t.Y36(m.F0),t.Y36(_.E),t.Y36(U.U))},i.\u0275cmp=t.Xpm({type:i,selectors:[["app-promote"]],viewQuery:function(e,o){if(1&e&&t.Gf(O,5),2&e){let s;t.iGM(s=t.CRH())&&(o.form=s.first)}},decls:40,vars:21,consts:[[1,"wrapper","min-h-full"],[1,"space-y-8","h-full"],[1,"flex","justify-start","items-center"],["href","javascript:void(0);",1,"flex","items-center",3,"routerLink"],[1,"icon-left_arrow","mr-4","text-2xl"],[1,"space-y-5",3,"formGroup"],[1,"flex","items-end","flex-wrap","-mx-2"],[1,"flex","flex-wrap","mb-7"],["class","w-1/2 lg:w-1/6 xl:w-1/6 p-3 group",4,"ngFor","ngForOf"],[4,"ngIf"],["class","w-full mb-7",4,"ngIf"],[1,"w-full","px-2","inputHolder","relative","pb-0.5","mb-7"],[1,"input-titel"],[1,"bg-white","rounded","p-8","mt-6","space-y-5"],["class","flex items-start",4,"ngIf"],["class","flex justify-between capitalize text-magicPotion",4,"ngIf"],[1,"block","border-b-2","border-dashed","border-gray-300"],[1,"flex","justify-between","capitalize"],[1,"icon-rs","rs-black","text-lg","mr-2"],["class","w-full px-2 inputHolder relative pb-0.5 mb-7",4,"ngIf"],["type","button",1,"secondary","w-full","uppercase","py-2.5","anim","mt-5",3,"click"],["ngNoForm","","id","nonseamless","method","post","name","redirect","action","https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"],["form",""],["type","hidden","id","encRequest","name","encRequest",3,"value"],["type","hidden","name","access_code","id","access_code",3,"value"],[1,"w-1/2","lg:w-1/6","xl:w-1/6","p-3","group"],[1,"user_type","text-center","bg-white","rounded","flex","flex-col","justify-between","items-center","h-full","px-5","py-7","anim","relative","group","cursor-pointer",3,"id"],["type","radio","name","user_type",1,"hidden",3,"formControlName","id","value","change"],[1,"absolute","inset-0","border-2","border-magicPotion","opacity-0","anim"],[1,"w-24","h-24"],[1,"w-full","h-full","object-contain",3,"src","alt"],[1,"text-base","text-sm","font-bold","pt-8","whitespace-pre-wrap"],[1,"w-full","lg:w-1/2","px-2","inputHolder","relative","pb-0.5","mb-7"],[1,"bg-white","rounded-md","flex","space-x-3","outline-0","px-6","py-3","relative","arrow",3,"formControlName"],[3,"value",4,"ngFor","ngForOf"],[1,"p-[12px]","rounded-md","mt-5","lg:mt-0"],[1,"text-base","font-bold","text-japaneseIndigo"],[3,"value"],[1,"w-full","mb-7"],[1,""],[1,"flex","flex-wrap","xl:flex-nowrap","justify-between","xl:space-x-5","items-center","py-5"],["class","w-full xl:w-1/3 pb-5 xl:pb-0",4,"ngFor","ngForOf"],[1,"border-t-2","border-gray-400","border-dashed","text-center","relative","my-10"],[1,"text-japaneseIndigo","py-1","px-10","absolute","-mt-5","bg-brightGray"],[1,"flex","items-end","justify-between"],[1,"w-1/2"],[1,"pb-3","input-titel"],[1,"bg-white","rounded-md","flex","space-x-3","outline-0","px-6","py-[18px]","relative","arrow","option",3,"formControlName","change"],[1,"bg-white","p-[18px]","rounded-md"],[1,"flex","pt-7"],[1,"flex","items-center","justify-between","inputHolder","bg-white","rounded-md","px-5","py-3"],["type","text","name","published_location","id","published_location",1,"input","text-base","font-bold","text-japaneseIndigo","w-full",3,"formControlName"],["href","javascript:void(0);"],[1,"icon-mark_location","text-magicPotion","text-3xl"],[1,"w-full","xl:w-1/3","pb-5","xl:pb-0"],[1,"absolute","-left-3","-bottom-3"],["src","../assets/images/event-subscription.png","alt","celebration"],[1,"cursor-pointer","relative",3,"for"],[1,"flex","items-center"],[1,"radio"],["type","radio","name","promotion-plan-card",1,"radio",3,"id","value","formControlName","click"],[1,"icon-right","text-white"],[1,"text-xl","font-normal","text-white","ml-5"],[1,"pt-7","space-y-3"],[1,"flex","w-full","justify-between","items-center"],[1,"text-sm","text-japaneseIndigo","font-bold"],[1,"flex","flex-wrap","lg:flex-nowrap","lg:space-x-12","pt-5"],[1,"w-full","lg:w-1/2","relative"],[1,"space-y-3","max-h-[540px]","overflow-y-auto"],["animationDuration",".5s","strokeWidth","8","class","absolute bg-white bg-opacity-25 backdrop-blur-sm inset-x-0 top-0 h-full w-full z-40","styleClass","custom-spinner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",3,"style",4,"ngIf"],[1,"flex","items-center","bg-white","rounded-md","cursor-pointer","w-full","px-4","py-3","sticky","top-0","z-10","shadow"],["for","is_selected_all",1,"checkbox","w-8","h-8"],["type","checkbox","name","is_selected_all","id","is_selected_all",1,"bgbrightgray",3,"formControlName","click"],[1,"icon-right","text-10","text-white"],[1,"text-base","text-japaneseIndigo","font-bold","ml-4"],["class","flex items-center bg-white rounded-md cursor-pointer w-full px-4 py-3",4,"ngFor","ngForOf"],["class","text-center",4,"ngIf"],[1,"w-full","lg:w-1/2","pt-5","lg:pt-0"],[1,"max-w-max","ml-auto","text-base","font-bold","text-japaneseIndigo","bg-white","py-3","px-8","rounded-md"],[1,"upload-holder","w-full","h-full","pt-5"],[1,"flex","items-end","justify-between","pb-3"],["target","_self",1,"secondary","px-5","py-2",3,"href"],["for","upload-csv",1,"upload","py-14"],["type","file","accept","text/csv, text/xml, text/xls, text/xlsx","name","upload-csv","id","upload-csv",1,"appearance-none","hidden",3,"change"],[1,"mt-1","flex","items-center","justify-center"],[1,"icon-excel","text-quicksilver","text-base","mr-2"],[1,"input-titel","pt-1"],["animationDuration",".5s","strokeWidth","8","styleClass","custom-spinner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",1,"absolute","bg-white","bg-opacity-25","backdrop-blur-sm","inset-x-0","top-0","h-full","w-full","z-40"],[1,"flex","items-center","bg-white","rounded-md","cursor-pointer","w-full","px-4","py-3"],[1,"checkbox","w-8","h-8"],["type","checkbox",1,"bgbrightgray",3,"id","checked","change"],[1,"flex","items-center","ml-4"],[1,"w-8","h-8","rounded-full","overflow-hidden","mr-4"],[1,"w-full","h-full","object-cover",3,"src","alt"],[1,"text-base","text-japaneseIndigo","font-bold"],[1,"text-center"],[1,"secondary","px-5","py-2",3,"click"],[1,"flex","items-start"],[1,"w-8","icon-bell_fill","text-magicPotion","text-2xl","mr-5"],[1,"w-full","flex","justify-between"],["class","text-sm text-gray-300 font-normal",4,"ngIf"],[1,"font-normal"],[1,"icon-rs","rs-black","text-base","mr-2"],[1,"text-sm","text-gray-300","font-normal"],[1,"w-8","icon-massage_fill","text-magicPotion","text-2xl","mr-5"],[1,"w-8","icon-email_fill","text-magicPotion","text-2xl","mr-5"],[1,"flex","justify-between","capitalize","text-magicPotion"],[1,"capitalize"],[4,"ngFor","ngForOf"],["class","flex justify-between items-center border border-caribbeanGreen rounded-md px-5 py-6 bg-green-50",4,"ngIf"],["class","bg-white rounded p-8 flex items-start mt-3",4,"ngIf"],[1,"flex","justify-between","items-center","border","border-caribbeanGreen","rounded-md","px-5","py-6","bg-green-50"],[1,"text-caribbeanGreen","pb-2"],[1,"text-sm","text-quicksilver"],["href","javascript:void(0);",3,"click"],[1,"icon-delete","text-magicPotion","text-2xl"],[1,"bg-white","rounded","p-8","flex","items-start","mt-3"],[1,"w-8","icon-coupan","text-magicPotion","text-2xl","mr-5"],[1,"text-sm","text-gray-300","font-normal",3,"innerHTML"],[1,"flex","items-center","text-lg","text-japaneseIndigo","capitalize"],[1,"bg-japaneseIndigo","text-white","border","border-japaneseIndigo","hover:bg-transparent","hover:text-japaneseIndigo","px-3","py-2","rounded-md","anim",3,"click"]],template:function(e,o){1&e&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"a",3),t._UZ(4,"i",4),t.qZA(),t.TgZ(5,"h2"),t._uU(6),t.ALo(7,"translate"),t.qZA()(),t.TgZ(8,"form",5)(9,"div",6)(10,"div",7),t.YNc(11,C,8,7,"div",8),t.qZA(),t.YNc(12,j,12,3,"ng-container",9),t.YNc(13,P,27,5,"div",10),t.YNc(14,N,33,9,"div",10),t.TgZ(15,"div",11)(16,"span",12),t._uU(17,"Bill Details"),t.qZA(),t.TgZ(18,"div",13),t.YNc(19,k,12,6,"div",14),t.YNc(20,E,12,6,"div",14),t.YNc(21,z,12,6,"div",14),t.YNc(22,Y,14,12,"div",14),t.YNc(23,G,8,4,"div",15),t._UZ(24,"span",16),t.TgZ(25,"div",17)(26,"h2"),t._uU(27,"total"),t.qZA(),t.TgZ(28,"h4"),t._UZ(29,"i",18),t._uU(30),t.ALo(31,"number"),t.qZA()()()(),t.YNc(32,K,4,1,"div",19),t.TgZ(33,"button",20),t.NdJ("click",function(){return o.payNow()}),t.TgZ(34,"h5"),t._uU(35,"Pay NOW"),t.qZA()()()(),t.TgZ(36,"form",21,22),t._UZ(38,"input",23)(39,"input",24),t.qZA()()()),2&e&&(t.xp6(3),t.Q6J("routerLink","/promotions"),t.xp6(3),t.Oqu(t.lcZ(7,16,"Promote")),t.xp6(2),t.Q6J("formGroup",o.promoteForm),t.xp6(3),t.Q6J("ngForOf",o.constants.userTypeArr),t.xp6(1),t.Q6J("ngIf","allusers"!==o.promoteForm.controls.usertype.value&&"existingusers"!==o.promoteForm.controls.usertype.value),t.xp6(1),t.Q6J("ngIf","allusers"===o.promoteForm.controls.usertype.value),t.xp6(1),t.Q6J("ngIf","existingusers"===o.promoteForm.controls.usertype.value),t.xp6(5),t.Q6J("ngIf",o.notificationObj&&o.notificationObj.is_notification),t.xp6(1),t.Q6J("ngIf",o.notificationObj&&o.notificationObj.is_sms),t.xp6(1),t.Q6J("ngIf",o.notificationObj&&o.notificationObj.is_email),t.xp6(1),t.Q6J("ngIf",o.selectedPlanObj&&o.calculateTotalObj.planDiscount),t.xp6(1),t.Q6J("ngIf",o.selectedCoupon&&o.selectedCoupon._id&&""!=o.selectedCoupon._id),t.xp6(7),t.Oqu(t.xi3(31,18,o.calculateTotalObj.total||0,"1.2-2")),t.xp6(2),t.Q6J("ngIf",o.couponsList&&o.couponsList.length),t.xp6(6),t.s9C("value",o.encRequestRes),t.xp6(1),t.s9C("value",o.accessCode))},dependencies:[m.yS,p.sg,p.O5,r._Y,r.YN,r.Kr,r.Fj,r.Wl,r.EJ,r._,r.JJ,r.JL,r.sg,r.u,b.G,p.JJ,f.X$],styles:[".ui-steps .ui-steps-item{width:25%}  .ui-steps.steps-custom{margin-bottom:30px}  .ui-steps.steps-custom .ui-steps-item .ui-menuitem-link{padding:0 1em;overflow:visible}  .ui-steps.steps-custom .ui-steps-item .ui-steps-number{background-color:#0081c2;color:#fff;display:inline-block;width:36px;border-radius:50%;margin-top:-14px;margin-bottom:10px}  .ui-steps.steps-custom .ui-steps-item .ui-steps-title{color:#555}  .outletPortal{display:flex;flex-direction:column;min-height:calc(100vh - 288px)}  .innerContent{max-height:calc(100vh - 510px);overflow-y:auto}  app-user-types,   app-users,   app-publish-date-and-time,   app-bill-details{display:flex;flex-direction:column;min-height:calc(100vh - 316px)}  .user_type>input:checked+span{opacity:1}  .user_type>input:checked~p{--tw-text-opacity: 1;color:rgb(254 77 95 / var(--tw-text-opacity))}"]}),i})();var W=a(1236),X=a(585);const tt=[{path:"",component:$}];let et=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=t.oAB({type:i}),i.\u0275inj=t.cJS({imports:[m.Bz.forChild(tt),p.ez,f.aw,W.q,r.UX,X._8,b.L]}),i})()}}]);