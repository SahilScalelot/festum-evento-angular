"use strict";(self.webpackChunkfestum_evento=self.webpackChunkfestum_evento||[]).push([[537],{537:(W,h,r)=>{r.r(h),r.d(h,{NotificationsModule:()=>V});var p=r(6895),f=r(7265),u=r(3144),t=r(4650),m=r(3053),d=r(2340),N=r(529);let _=(()=>{class e{constructor(i,n){this.http=i,this._globalFunctions=n}getNotificationList(i){return this.http.post(d.N.appURL+"organizer/notification",i,this._globalFunctions.getAuthorizationHeader())}createNotification(i){return this.http.post(d.N.appURL+"organizer/notification/save",i,this._globalFunctions.getAuthorizationHeader())}getNotificationById(i){return this.http.post(d.N.appURL+"organizer/notification/getone",{notificationid:i},this._globalFunctions.getAuthorizationHeader())}uploadBanner(i){return this.http.post(d.N.appURL+"organizer/notification/banner",i,this._globalFunctions.getFileAuthorizationHeader())}}return e.\u0275fac=function(i){return new(i||e)(t.LFG(N.eN),t.LFG(m.E))},e.\u0275prov=t.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e})();var b=r(1997);function y(e,s){if(1&e){const i=t.EpF();t.TgZ(0,"div",26)(1,"div",27)(2,"div",11),t._UZ(3,"img",28),t.qZA(),t.TgZ(4,"div",29)(5,"div",14)(6,"h4"),t._uU(7),t.qZA(),t.TgZ(8,"a",30),t._UZ(9,"i",31),t.qZA()(),t._UZ(10,"p",32),t.TgZ(11,"div",33)(12,"button",34),t.NdJ("click",function(){const a=t.CHM(i).$implicit,l=t.oxw();return t.KtG(l.promoteNotification(null==a?null:a._id))}),t._UZ(13,"i",35),t.TgZ(14,"span"),t._uU(15,"Promote"),t.qZA()()()()()()}if(2&e){const i=s.$implicit,n=t.oxw();t.xp6(3),t.Q6J("src",(null==n.constants?null:n.constants.baseImageURL)+(null==i?null:i.banner),t.LSH)("alt",null==i?null:i.notification_title),t.xp6(4),t.Oqu(null==i?null:i.notification_title),t.xp6(3),t.Q6J("innerHTML",null==i?null:i.description,t.oJD)}}function C(e,s){1&e&&(t.TgZ(0,"p"),t._uU(1,"No Notification Records Found, Create new Notification."),t.qZA())}const T=function(){return[10,20,30,50]};function I(e,s){if(1&e){const i=t.EpF();t.TgZ(0,"div",36)(1,"p-paginator",37),t.NdJ("onPageChange",function(o){t.CHM(i);const a=t.oxw();return t.KtG(a.getOnlineShopOffers(o))}),t.qZA()()}if(2&e){const i=t.oxw();t.xp6(1),t.Q6J("rows",null==i.paging?null:i.paging.limit)("totalRecords",null==i.paging?null:i.paging.totalDocs)("rowsPerPageOptions",t.DdM(3,T))}}let F=(()=>{class e{constructor(i,n,o){this._router=i,this._globalFunctions=n,this._notificationsService=o,this.notificationObj=[],this.constants=u.t,this.isLoading=!1}ngOnInit(){this._globalFunctions.removeIdsFromLocalStorage(),this.getOnlineShopOffers()}promoteNotification(i=""){localStorage.setItem("nId",i),this._router.navigate(["/notifications/promote/user-type"])}getOnlineShopOffers(i={}){this.isLoading=!0,this._notificationsService.getNotificationList({page:(i?i.page+1:1)||"1",limit:i?.rows||"10",search:""}).subscribe(a=>{a&&a.IsSuccess?(this.notificationObj=this._globalFunctions.copyObject(a.Data.docs),this.paging=a.Data):this._globalFunctions.successErrorHandling(a,this,!0),this.isLoading=!1},a=>{this._globalFunctions.errorHanding(a,this,!0),this.isLoading=!1})}}return e.\u0275fac=function(i){return new(i||e)(t.Y36(f.F0),t.Y36(m.E),t.Y36(_))},e.\u0275cmp=t.Xpm({type:e,selectors:[["app-notifications"]],decls:40,vars:3,consts:[[1,"wrapper","min-h-full"],[1,"space-y-8","h-full"],[1,"flex","justify-between","items-center"],["href","javascript:void(0);",1,"flex","items-center"],[1,"flex","items-center","space-x-5"],[1,"secondary","px-5","py-2","capitalize","anim"],[1,"icon-history","mr-3"],["routerLink","create",1,"secondary","px-5","py-2","capitalize","anim"],[1,"icon-plus","mr-3"],[1,"space-y-5"],[1,"bg-white","p-7","rounded-md"],[1,"relative","w-full","md:max-w-[128px]"],["src","../assets/images/creat-notification.png","alt","Notification",1,"w-32","h-32","object-cover"],[1,"pl-5"],[1,"flex","justify-between"],[1,"text-gray-400","text-base","pt-3","font-medium"],["class","bg-white p-5 rounded-md",4,"ngFor","ngForOf"],[4,"ngIf"],["class","flex flex-wrap items-center justify-center",4,"ngIf"],[1,"w-full","mt-5","addsBox"],["src","/assets/images/banner-ads.png","alt","ring-ad",1,"w-full","object-cover"],[1,"prw-next-btn"],["type","button",1,"flex","items-center"],[1,"icon-left_arrow","mr-3"],["type","button",1,"flex","items-center","active"],[1,"icon-right_arrow","ml-3"],[1,"bg-white","p-5","rounded-md"],[1,"flex","justify-between","items-start"],[1,"w-32","h-32","object-cover","pb-5","lg:pb-0",3,"src","alt"],[1,"pl-5","w-full","md:max-w-[clac(100%-128px)]"],["href","javascript:void(0);"],[1,"icon-more","font-bold","text-base"],[1,"text-gray-400","text-base","pt-3","font-medium",3,"innerHTML"],[1,"flex","justify-end"],[1,"secondary","flex","items-center","px-3","py-1.5","anim",3,"click"],[1,"icon-fill_megaphone","mr-2"],[1,"flex","flex-wrap","items-center","justify-center"],[3,"rows","totalRecords","rowsPerPageOptions","onPageChange"]],template:function(i,n){1&i&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"a",3)(4,"h2"),t._uU(5,"Notification"),t.qZA()(),t.TgZ(6,"div",4)(7,"button",5),t._UZ(8,"i",6),t.TgZ(9,"span"),t._uU(10,"history"),t.qZA()(),t.TgZ(11,"button",7),t._UZ(12,"i",8),t.TgZ(13,"span"),t._uU(14,"Create new"),t.qZA()()()(),t.TgZ(15,"div",9)(16,"div",10)(17,"div",2)(18,"div",11),t._UZ(19,"img",12),t.qZA(),t.TgZ(20,"div",13)(21,"div",14)(22,"h4"),t._uU(23,"Create an notification as you want!"),t.qZA()(),t.TgZ(24,"p",15),t._uU(25,"Simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, Simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the "),t.qZA()()()(),t.YNc(26,y,16,4,"div",16),t.YNc(27,C,2,0,"p",17),t.YNc(28,I,2,4,"div",18),t.TgZ(29,"div",19),t._UZ(30,"img",20),t.qZA(),t.TgZ(31,"div",21)(32,"button",22),t._UZ(33,"i",23),t.TgZ(34,"h5"),t._uU(35,"Back"),t.qZA()(),t.TgZ(36,"button",24)(37,"h5"),t._uU(38,"Next"),t.qZA(),t._UZ(39,"i",25),t.qZA()()()()()),2&i&&(t.xp6(26),t.Q6J("ngForOf",n.notificationObj),t.xp6(1),t.Q6J("ngIf",!n.notificationObj||!(null!=n.notificationObj&&n.notificationObj.length)),t.xp6(1),t.Q6J("ngIf",n.notificationObj&&(null==n.notificationObj?null:n.notificationObj.length)))},dependencies:[f.rH,p.sg,p.O5,b.D]}),e})();var c=r(433),w=r(3385),g=r(7489),U=r(4386),A=r(5922),k=r(5152),x=r(7651),v=r(7932),Z=r(142);function L(e,s){1&e&&(t.TgZ(0,"span"),t._uU(1," Notification title is required. "),t.qZA())}function q(e,s){if(1&e&&(t.TgZ(0,"span",42),t.YNc(1,L,2,0,"span",43),t.qZA()),2&e){const i=t.oxw();let n;t.xp6(1),t.Q6J("ngIf",null==(n=i.notificationForm.get("notification_title"))||null==n.errors?null:n.errors.required)}}function S(e,s){1&e&&(t.TgZ(0,"span"),t._uU(1," Link is required. "),t.qZA())}function J(e,s){1&e&&(t.TgZ(0,"span"),t._uU(1," Please enter valid link. "),t.qZA())}function j(e,s){if(1&e&&(t.TgZ(0,"span",42),t.YNc(1,S,2,0,"span",43),t.YNc(2,J,2,0,"span",43),t.qZA()),2&e){const i=t.oxw();let n,o;t.xp6(1),t.Q6J("ngIf",null==(n=i.notificationForm.get("link"))||null==n.errors?null:n.errors.required),t.xp6(1),t.Q6J("ngIf",null==(o=i.notificationForm.get("link"))||null==o.errors?null:o.errors.pattern)}}const E=function(){return{width:"20px",height:"20px"}};function O(e,s){1&e&&t._UZ(0,"p-progressSpinner",44),2&e&&t.Akn(t.DdM(2,E))}function z(e,s){if(1&e&&(t.TgZ(0,"a",45),t._uU(1,"View"),t.qZA()),2&e){const i=t.oxw();t.Q6J("href",i.constants.baseImageURL+i.image.value,t.LSH)}}function P(e,s){1&e&&(t.TgZ(0,"span"),t._uU(1," Photo is required. "),t.qZA())}function Q(e,s){if(1&e&&(t.TgZ(0,"span",42),t.YNc(1,P,2,0,"span",43),t.qZA()),2&e){const i=t.oxw();t.xp6(1),t.Q6J("ngIf",null==i.image||null==i.image.errors?null:i.image.errors.required)}}function Y(e,s){1&e&&(t.TgZ(0,"span"),t._uU(1," Description is required. "),t.qZA())}function H(e,s){if(1&e&&(t.TgZ(0,"span",46),t.YNc(1,Y,2,0,"span",43),t.qZA()),2&e){const i=t.oxw();let n;t.xp6(1),t.Q6J("ngIf",null==(n=i.notificationForm.get("description"))||null==n.errors?null:n.errors.required)}}function D(e,s){1&e&&(t.TgZ(0,"div",47),t._UZ(1,"mat-progress-spinner",48),t.qZA()),2&e&&(t.xp6(1),t.Q6J("diameter",22)("mode","indeterminate"))}const B=function(e){return{"opacity-0":e}};let M=(()=>{class e{constructor(i,n,o,a,l,K){this._formBuilder=i,this._router=n,this._globalFunctions=o,this._notificationService=a,this._modalService=l,this._sNotify=K,this.notificationId="",this.editorConfig={},this.constants=u.t,this.detailEditor=w,this.isLoading=!1,this.isPhotoLoading=!1,this.isCreateNotificationLoading=!1}get image(){return this.notificationForm?.get("banner")}ngOnInit(){this.editorConfig=u.t.editorConfig,this._prepareNotificationForm(),localStorage.getItem("nId")&&""!=localStorage.getItem("nId")&&(this.notificationId=localStorage.getItem("nId"),this.getNotificationById(this.notificationId))}onTextEditorReady(i){i.ui.getEditableElement().parentElement.insertBefore(i.ui.view.toolbar.element,i.ui.getEditableElement())}getNotificationById(i){this.isLoading=!0,this._notificationService.getNotificationById(i).subscribe(n=>{if(n&&n.IsSuccess){const o=n?.Data||{};this._prepareNotificationForm(o||{}),o.banner&&(this.inputText=g.last(g.split(o.banner,"/"))),this.isLoading=!1}else this._globalFunctions.successErrorHandling(n,this,!0),this.isLoading=!1},n=>{this._globalFunctions.errorHanding(n,this,!0),this.isLoading=!1})}onChangePhoto(i){if(!(i&&i.target&&i.target.files&&i.target.files.length))return!1;const n=i.target.files[0];if(null!=n){if("image/jpeg"!=n.type&&"image/jpg"!=n.type&&"image/png"!=n.type)return this._sNotify.error("Image type is Invalid.","Oops!"),!1;if(n.size/1024/1024>u.t.maxImageSizeInMB)return this._sNotify.error("Maximum Photo Size is "+u.t.maxImageSizeInMB+"MB.","Oops!"),!1;const a=new FormData;a.append("file",n),this.isPhotoLoading=!0,this._notificationService.uploadBanner(a).subscribe(l=>{l&&l.IsSuccess?(this.image.setValue(l.Data.url),this.inputText=g.last(g.split(l.Data.url,"/")),this._sNotify.success("Photo Uploaded Successfully.","Success"),this.isPhotoLoading=!1):(this._globalFunctions.successErrorHandling(l,this,!0),this.isPhotoLoading=!1)},l=>{this._globalFunctions.errorHanding(l,this,!0),this.isPhotoLoading=!1})}}validateForm(){return!this.notificationForm.invalid||(Object.keys(this.notificationForm.controls).forEach(i=>{this.notificationForm.controls[i].touched=!0,this.notificationForm.controls[i].markAsDirty()}),!1)}openPreviewNotification(){if(!this.validateForm())return!1;this._modalService.open("notification-pop")}createNotification(){if(!this.validateForm())return!1;this.isCreateNotificationLoading=!0,this._notificationService.createNotification(this.notificationForm.value).subscribe(i=>{i&&i.IsSuccess?(this._modalService.close("notification-pop"),this._sNotify.success("Notification Created Successfully.","Success"),this._router.navigate(["/notifications"]),this.isCreateNotificationLoading=!1):(this._globalFunctions.successErrorHandling(i,this,!0),this.isCreateNotificationLoading=!1)},i=>{this._globalFunctions.errorHanding(i,this,!0),this.isCreateNotificationLoading=!1})}_prepareNotificationForm(i={}){this.notificationForm=this._formBuilder.group({notificationid:[this.notificationId||""],notification_title:[i?.notification_title||"",[c.kI.required]],link:[i?.link||"",[c.kI.required,c.kI.pattern("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")]],banner:[i?.banner||"",[c.kI.required]],description:[i?.description||"",[c.kI.required]],status:[!0]})}}return e.\u0275fac=function(i){return new(i||e)(t.Y36(c.qu),t.Y36(f.F0),t.Y36(m.E),t.Y36(_),t.Y36(U.Z),t.Y36(A.VZ))},e.\u0275cmp=t.Xpm({type:e,selectors:[["app-create-notifications"]],decls:67,vars:19,consts:[[1,"wrapper","min-h-full"],[1,"space-y-8","h-full"],[1,"flex","justify-start","items-center"],["href","javascript:void(0);",1,"flex","items-center",3,"routerLink"],[1,"icon-left_arrow","mr-4","text-2xl"],[1,"space-y-5",3,"formGroup"],[1,"flex","items-end","flex-wrap","-mx-2"],[1,"w-full","md:w-1/2","px-2","inputHolder","relative","pb-0.5","mb-7"],[1,"input-titel","text-xl","text-japaneseIndigo","font-bold"],["type","text","id","notification-title","formControlName","notification_title",1,"input"],["class","absolute top-full text-red-500 text-xs",4,"ngIf"],["type","text","id","link","formControlName","link",1,"input"],[1,"w-full","relative","group","px-2","pb-0.5","mb-7"],["animationDuration",".5s","strokeWidth","4","class","absolute bg-white bg-opacity-25 backdrop-blur-sm inset-x-1 bottom-0 top-10 z-20","styleClass","custom-spinner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",3,"style",4,"ngIf"],[1,"upload","upload-popup","py-3"],["accept","image/png, image/jpeg, image/jpg","id","banner","name","banner","type","file",1,"appearance-none","hidden",3,"change"],[1,"input-titel","text-base","p-0"],[1,"icon-pdf_upload","mr-2"],[1,"normal-case"],["class","absolute right-4 bottom-3 py-0.5 px-2 normal-case text-gray-400 anim hover:text-magicPotion text-sm font-semibold hidden border border-current group-hover:inline-block","target","_blank","title","View Image",3,"href",4,"ngIf"],[1,"w-full","space-y-2.5","px-2","relative","pb-0.5","mb-7"],[1,"w-full","bg-white","rounded"],["id","description-editor","name","description",1,"h-44","text-editor",3,"config","editor","formControlName","ready"],["class","absolute top-full text-red-500 text-xs ml-0",4,"ngIf"],[1,"w-full","px-2","text-right"],[1,"bg-japaneseIndigo","rounded-lg","text-white","capitalize","hover:bg-transparent","border","border-japaneseIndigo","hover:text-japaneseIndigo","px-8","py-2","anim",3,"click"],[1,"prw-next-btn"],["type","button",1,"flex","items-center"],[1,"icon-left_arrow","mr-3"],[1,"relative"],["type","submit",1,"secondary","px-6","py-2","anim",3,"click"],[3,"ngClass"],["class","absolute inset-0 text-white flex items-center",4,"ngIf"],["id","notification-pop","title","Notification","maxWidth","lg:max-w-7xl xl:px-0",1,"popup","table","fixed","w-full","inset-0","z-40","bg-black","bg-opacity-75","h-screen","hidden"],[1,"relative","pt-5"],[1,"bg-white","p-7","rounded-md","w-full"],[1,"flex","justify-between","items-start"],[1,"relative","w-full","md:max-w-[128px]"],["alt","Notification",1,"w-32","h-32","object-cover",3,"src"],[1,"pl-5","w-full","md:max-w-[clac(100%-128px)]"],[1,"flex","justify-between"],[1,"text-gray-400","text-base","pt-3","font-medium","normal-case",3,"innerHtml"],[1,"absolute","top-full","text-red-500","text-xs"],[4,"ngIf"],["animationDuration",".5s","strokeWidth","4","styleClass","custom-spinner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",1,"absolute","bg-white","bg-opacity-25","backdrop-blur-sm","inset-x-1","bottom-0","top-10","z-20"],["target","_blank","title","View Image",1,"absolute","right-4","bottom-3","py-0.5","px-2","normal-case","text-gray-400","anim","hover:text-magicPotion","text-sm","font-semibold","hidden","border","border-current","group-hover:inline-block",3,"href"],[1,"absolute","top-full","text-red-500","text-xs","ml-0"],[1,"absolute","inset-0","text-white","flex","items-center"],[1,"mx-auto",3,"diameter","mode"]],template:function(i,n){if(1&i&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"a",3),t._UZ(4,"i",4),t.qZA(),t.TgZ(5,"h2"),t._uU(6,"Create New Notification"),t.qZA()(),t.TgZ(7,"form",5)(8,"div",6)(9,"div",7)(10,"span",8),t._uU(11,"Notification Title"),t.TgZ(12,"span"),t._uU(13,"*"),t.qZA()(),t._UZ(14,"input",9),t.YNc(15,q,2,1,"span",10),t.qZA(),t.TgZ(16,"div",7)(17,"span",8),t._uU(18,"Link"),t.TgZ(19,"span"),t._uU(20,"*"),t.qZA()(),t._UZ(21,"input",11),t.YNc(22,j,3,2,"span",10),t.qZA(),t.TgZ(23,"div",12)(24,"h5",8),t._uU(25,"Photo"),t.TgZ(26,"span"),t._uU(27,"*"),t.qZA()(),t.YNc(28,O,1,3,"p-progressSpinner",13),t.TgZ(29,"label",14)(30,"input",15),t.NdJ("change",function(a){return n.onChangePhoto(a)}),t.qZA(),t.TgZ(31,"span",16),t._UZ(32,"i",17),t.TgZ(33,"span",18),t._uU(34),t.qZA()()(),t.YNc(35,z,2,1,"a",19),t.YNc(36,Q,2,1,"span",10),t.qZA(),t.TgZ(37,"div",20)(38,"h5"),t._uU(39,"Description"),t.qZA(),t.TgZ(40,"div",21)(41,"ckeditor",22),t.NdJ("ready",function(a){return n.onTextEditorReady(a)}),t.qZA(),t.YNc(42,H,2,1,"span",23),t.qZA()(),t.TgZ(43,"div",24)(44,"button",25),t.NdJ("click",function(){return n.openPreviewNotification()}),t._uU(45,"preview"),t.qZA()()(),t.TgZ(46,"div",26)(47,"button",27),t._UZ(48,"i",28),t.TgZ(49,"h5"),t._uU(50,"Back"),t.qZA()(),t.TgZ(51,"div",29)(52,"button",30),t.NdJ("click",function(){return n.createNotification()}),t.TgZ(53,"span",31),t._uU(54,"Done"),t.qZA()(),t.YNc(55,D,2,2,"div",32),t.qZA()()()()(),t.TgZ(56,"modal",33)(57,"div",34)(58,"div",35)(59,"div",36)(60,"div",37),t._UZ(61,"img",38),t.qZA(),t.TgZ(62,"div",39)(63,"div",40)(64,"h4"),t._uU(65),t.qZA()(),t._UZ(66,"p",41),t.qZA()()()()()),2&i){let o,a,l;t.xp6(3),t.Q6J("routerLink","/notifications"),t.xp6(4),t.Q6J("formGroup",n.notificationForm),t.xp6(8),t.Q6J("ngIf",(null==(o=n.notificationForm.get("notification_title"))?null:o.invalid)&&(null==(o=n.notificationForm.get("notification_title"))?null:o.dirty)&&(null==(o=n.notificationForm.get("notification_title"))?null:o.touched)),t.xp6(7),t.Q6J("ngIf",(null==(a=n.notificationForm.get("link"))?null:a.invalid)&&(null==(a=n.notificationForm.get("link"))?null:a.dirty)&&(null==(a=n.notificationForm.get("link"))?null:a.touched)),t.xp6(6),t.Q6J("ngIf",n.isPhotoLoading),t.xp6(6),t.Oqu(n.inputText?n.inputText:"Upload Image"),t.xp6(1),t.Q6J("ngIf",n.inputText),t.xp6(1),t.Q6J("ngIf",(null==n.image?null:n.image.invalid)&&(null==n.image?null:n.image.dirty)&&(null==n.image?null:n.image.touched)),t.xp6(5),t.Q6J("config",n.editorConfig)("editor",n.detailEditor)("formControlName","description"),t.xp6(1),t.Q6J("ngIf",(null==(l=n.notificationForm.get("description"))?null:l.invalid)&&(null==(l=n.notificationForm.get("description"))?null:l.dirty)&&(null==(l=n.notificationForm.get("description"))?null:l.touched)),t.xp6(11),t.Q6J("ngClass",t.VKq(17,B,n.isCreateNotificationLoading)),t.xp6(2),t.Q6J("ngIf",n.isCreateNotificationLoading),t.xp6(6),t.Q6J("src",null!=n.image&&n.image.value?n.constants.baseImageURL+n.image.value:n.constants.defaultImage,t.LSH),t.xp6(4),t.Oqu(null==n.notificationForm.value?null:n.notificationForm.value.notification_title),t.xp6(1),t.Q6J("innerHtml",null==n.notificationForm.value?null:n.notificationForm.value.description,t.oJD)}},dependencies:[f.yS,p.mk,p.O5,k.z,x.u,c._Y,c.Fj,c.JJ,c.JL,c.sg,c.u,v.G,Z.Ou],styles:[".ck-editor__editable_inline{min-height:350px!important}  .ck.ck-editor__editable.ck-focused:not(.ck-editor__nested-editable){border:none;box-shadow:none}  .ck-reset_all :not(.ck-reset_all-excluded *),   .ck.ck-reset_all{margin:4px 0}  .ck.ck-toolbar{border:0 none;border-bottom:1px solid #EEEEEE}  .ck.ck-toolbar .ck.ck-toolbar__separator{background:#EEEEEE}  input.small-input{width:100%;--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding-top:0;padding-bottom:0;padding-left:.75rem;padding-right:3rem}"]}),e})();var R=r(3474);const G=[{path:"",component:F},{path:"create",component:M},{path:"promote",loadChildren:()=>r.e(25).then(r.bind(r,1025)).then(e=>e.PromoteModule)}];let V=(()=>{class e{}return e.\u0275fac=function(i){return new(i||e)},e.\u0275mod=t.oAB({type:e}),e.\u0275inj=t.cJS({imports:[f.Bz.forChild(G),p.ez,R.z,x.d,c.UX,b.U,v.L,Z.Cq]}),e})()}}]);