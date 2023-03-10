"use strict";(self.webpackChunkfestum_evento=self.webpackChunkfestum_evento||[]).push([[608],{4503:(Ye,y,s)=>{s.r(y),s.d(y,{LiveStreamModule:()=>Qe});var u=s(6895),m=s(5072),Z=s(3144),e=s(4650),D=s(4386),w=s(3053),f=s(2340),I=s(529);let j=(()=>{class n{constructor(t,i){this.http=t,this._globalFunctions=i}liveStreamsList(t){return this.http.post(f.N.appURL+"organizer/livestream",t,this._globalFunctions.getAuthorizationHeader())}getLiveStreamById(t){return this.http.post(f.N.appURL+"organizer/livestream/getone",{livestreamid:t},this._globalFunctions.getAuthorizationHeader())}removeLiveStreamById(t){return this.http.post(f.N.appURL+"organizer/livestream/remove",{livestreamid:t},this._globalFunctions.getAuthorizationHeader())}exportAttendees(t={}){return this.http.post(f.N.appURL+"organizer/livestreamattendees/export",t,this._globalFunctions.getAuthorizationHeader())}}return n.\u0275fac=function(t){return new(t||n)(e.LFG(I.eN),e.LFG(w.E))},n.\u0275prov=e.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"}),n})();var v=s(4006),T=s(7932),P=s(5152),U=s(1572),L=s(1997),O=s(6408);let F=(()=>{class n{transform(t){let i=t.split(":")[0],o=t.split(":")[1],r=i>12?"pm":"am";return 0==parseInt(i)&&(i=12),o=1==(o+"").length?`0${o}`:o,i=i>12?i-12:i,i=1==(i+"").length?`0${i}`:i,`${i}:${o} ${r}`}}return n.\u0275fac=function(t){return new(t||n)},n.\u0275pipe=e.Yjl({name:"convertFrom24To12Format",type:n,pure:!0}),n})();const H=function(){return{width:"50px",height:"50px"}};function Q(n,l){1&n&&e._UZ(0,"p-progressSpinner",23),2&n&&e.Akn(e.DdM(2,H))}const Y=function(n){return{hidden:n}},z=function(n){return{secondary:n}},G=function(n){return{"text-caribbeanGreen":n}};function V(n,l){if(1&n){const t=e.EpF();e.TgZ(0,"div",26),e.NdJ("click",function(o){const a=e.CHM(t).$implicit,c=e.oxw(2);return e.KtG(c.liveStreamOverview(o,null==a?null:a._id))}),e.TgZ(1,"div",27)(2,"div",28)(3,"div",29)(4,"span",30),e._uU(5,"Live"),e.qZA(),e._UZ(6,"img",31),e.qZA(),e.TgZ(7,"div",32)(8,"div",33)(9,"div",34)(10,"h4",35),e._uU(11),e.qZA(),e.TgZ(12,"div",36)(13,"div",34)(14,"div",37),e._UZ(15,"i",38),e._uU(16,"Date"),e.qZA(),e.TgZ(17,"span",39),e._uU(18),e.ALo(19,"date"),e.qZA()(),e.TgZ(20,"div",40)(21,"div",37),e._UZ(22,"i",41),e._uU(23,"Time"),e.qZA(),e.TgZ(24,"span",42),e._uU(25),e.ALo(26,"convertFrom24To12Format"),e.ALo(27,"convertFrom24To12Format"),e.qZA()()()(),e.TgZ(28,"div",43)(29,"button",44),e._UZ(30,"i",45),e._uU(31,"go live"),e.qZA(),e.TgZ(32,"p",46),e._uU(33),e.qZA()()(),e.TgZ(34,"div",47)(35,"div",48)(36,"p-rating",49),e.NdJ("ngModelChange",function(o){const a=e.CHM(t).$implicit;return e.KtG(a.ratings=o)}),e.qZA(),e.TgZ(37,"span",50),e._uU(38),e.qZA()(),e.TgZ(39,"div",51)(40,"a",52),e._UZ(41,"i",53),e.qZA(),e.TgZ(42,"a",54),e.NdJ("click",function(o){const a=e.CHM(t).$implicit,c=e.oxw(2);return e.KtG(c.editLiveStream(o,null==a?null:a._id))}),e._UZ(43,"i",55),e.qZA(),e.TgZ(44,"a",54),e.NdJ("click",function(o){const a=e.CHM(t).$implicit,c=e.oxw(2);return e.KtG(c.openDeleteDialog(o,a))}),e._UZ(45,"i",56),e.qZA()()()()()()()}if(2&n){const t=l.$implicit,i=e.oxw(2);e.xp6(4),e.Q6J("ngClass",e.VKq(21,Y,!(null!=t&&t.status))),e.xp6(2),e.Q6J("src",null!=t&&null!=t.photos[0]&&t.photos[0].url?i.constants.baseImageURL+t.photos[0].url:i.constants.defaultImage,e.LSH)("alt",null==t?null:t.event_name),e.xp6(5),e.Oqu(null==t?null:t.event_name),e.xp6(7),e.Oqu(e.xi3(19,14,null==t?null:t.event_date,"dd MMM, yyyy")),e.xp6(7),e.AsE("",e.lcZ(26,17,null==t?null:t.event_start_time)," - ",e.lcZ(27,19,null==t?null:t.event_end_time),""),e.xp6(4),e.Q6J("ngClass",e.VKq(23,z,null==t?null:t.status)),e.xp6(3),e.Q6J("ngClass",e.VKq(25,G,null==t?null:t.status)),e.xp6(1),e.hij("",null==t?null:t.event_type," live streaming"),e.xp6(3),e.Q6J("ngModel",t.ratings)("readonly",!0)("cancel",!1),e.xp6(2),e.hij(" ",null==t?null:t.totalreview," ratings")}}function $(n,l){if(1&n&&(e.TgZ(0,"div",24),e.YNc(1,V,46,27,"div",25),e.qZA()),2&n){const t=e.oxw();e.xp6(1),e.Q6J("ngForOf",t.liveStreamObj)}}const B=function(){return[10,20,30,50]};function W(n,l){if(1&n){const t=e.EpF();e.TgZ(0,"div",57)(1,"p-paginator",58),e.NdJ("onPageChange",function(o){e.CHM(t);const r=e.oxw();return e.KtG(r.getLiveStreamObj(o))}),e.qZA()()}if(2&n){const t=e.oxw();e.xp6(1),e.Q6J("rows",null==t.paging?null:t.paging.limit)("totalRecords",null==t.paging?null:t.paging.totalDocs)("rowsPerPageOptions",e.DdM(3,B))}}function K(n,l){1&n&&(e.TgZ(0,"div",59)(1,"h4",60),e._uU(2,"You have no streams yet."),e.qZA(),e.TgZ(3,"p",34),e._uU(4,"Create an stream using the Create new stream button on the top right of the page.."),e.qZA()())}function X(n,l){1&n&&(e.TgZ(0,"div",61),e._UZ(1,"mat-progress-spinner",62),e.qZA()),2&n&&(e.xp6(1),e.Q6J("diameter",22)("mode","indeterminate"))}const ee=function(n){return{"opacity-0":n}};let te=(()=>{class n{constructor(t,i,o,r){this._router=t,this._modalService=i,this._globalFunctions=o,this._liveStreamService=r,this.liveStreamObj=[],this.constants=Z.t,this.isLoading=!1,this.platformsArr=[],this.platformsId="",this.tmpLSObj={},this.isDeleteLoading=!1}ngOnInit(){this._globalFunctions.removeIdsFromLocalStorage(),this.getLiveStreamObj()}getLiveStreamObj(t={}){this.isLoading=!0,this._liveStreamService.liveStreamsList({page:(t?t.page+1:1)||"1",limit:t?.rows||"10",search:""}).subscribe(r=>{r&&r.IsSuccess?(this.liveStreamObj=this._globalFunctions.copyObject(r.Data.docs),this.paging=r.Data):this._globalFunctions.successErrorHandling(r,this,!0),this.isLoading=!1},r=>{this._globalFunctions.errorHanding(r,this,!0),this.isLoading=!1})}editLiveStream(t,i){t.stopPropagation(),localStorage.setItem("lsId",i),this._router.navigate(["/live-stream/create/stream"])}openDeleteDialog(t,i){t.stopPropagation(),this.tmpLSObj=i,this._modalService.open("delete-ls-pop")}closeDeleteDialog(){this.tmpLSObj={},this._modalService.close("delete-ls-pop")}deleteLiveStream(){this.isDeleteLoading=!0,this._liveStreamService.removeLiveStreamById(this.tmpLSObj._id).subscribe(t=>{t&&t.IsSuccess?(this.isDeleteLoading=!1,this.getLiveStreamObj(),this.closeDeleteDialog()):(this._globalFunctions.successErrorHandling(t,this,!0),this.isDeleteLoading=!1)},t=>{this._globalFunctions.errorHanding(t,this,!0),this.isDeleteLoading=!1})}liveStreamOverview(t,i){t.stopPropagation(),this._router.navigate(["/live-stream/"+i])}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(m.F0),e.Y36(D.Z),e.Y36(w.E),e.Y36(j))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-live-stream"]],decls:30,vars:11,consts:[["animationDuration",".5s","strokeWidth","8","class","absolute bg-white bg-opacity-25 backdrop-blur-sm inset-x-0 top-0 h-full w-full z-40","styleClass","custom-spinner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",3,"style",4,"ngIf"],[1,"wrapper"],[1,"flex","flex-wrap","items-center"],[1,"flex","whitespace-nowrap","space-x-5","ml-auto"],["routerLink","/live-stream/create/stream",1,"secondary","anim","px-8","py-2"],[1,"icon-plus","mr-3"],[1,"space-y-5","pt-10"],["class","space-y-5",4,"ngIf"],["class","flex flex-wrap items-center justify-center",4,"ngIf"],[1,"w-full","mt-5","addsBox"],["src","/assets/images/banner-ads.png","alt","ring-ad",1,"w-full","object-cover"],["class","bg-white rounded-md text-center p-9 space-y-2",4,"ngIf"],["id","delete-ls-pop","title","Are you sure?",1,"popup","table","fixed","w-full","inset-0","z-40","bg-black","bg-opacity-75","h-screen","hidden",3,"isCloseHidden","isTitleHidden"],[1,"flex","flex-wrap","relative"],[1,"w-full","pb-8"],[1,"w-full","pb-2","normal-case"],[1,"normal-case"],[1,"flex","items-center","justify-end","space-x-5","w-full"],["type","button",1,"primary","py-2","px-14","anim","uppercase",3,"click"],[1,"relative"],["type","submit",1,"secondary","py-2","px-14","anim","uppercase",3,"click"],[3,"ngClass"],["class","absolute inset-0 text-white flex items-center",4,"ngIf"],["animationDuration",".5s","strokeWidth","8","styleClass","custom-spinner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",1,"absolute","bg-white","bg-opacity-25","backdrop-blur-sm","inset-x-0","top-0","h-full","w-full","z-40"],[1,"space-y-5"],["class","w-full flex items-center cursor-pointer",3,"click",4,"ngFor","ngForOf"],[1,"w-full","flex","items-center","cursor-pointer",3,"click"],[1,"w-full","p-4","pr-7","bg-white","rounded"],[1,"flex","flex-wrap","lg:flex-nowrap","lg:space-x-5"],[1,"relative","w-full","lg:max-w-[335px]","overflow-hidden","rounded"],[1,"absolute","py-1.5","px-3","top-0","left-0","bg-magicPotion","text-white","uppercase","rounded","text-xs",3,"ngClass"],[1,"w-full","h-full","object-cover","pb-5","lg:pb-0","lg:absolute",3,"src","alt"],[1,"w-full","pt-5","lg:pt-0"],[1,"flex","justify-between","border-b-2","pb-4"],[1,""],[1,"text-japaneseIndigo"],[1,"flex","pt-3"],[1,"text-sm","font-semibold","text-quicksilver","pt-3"],[1,"icon-calendar-2","mr-3"],[1,"text-japaneseIndigo","text-sm","font-bold"],[1,"border-l-2","border-brightGray","pl-3","lg:pl-7","ml-3","lg:ml-7"],[1,"icon-time","mr-3"],[1,"text-japaneseIndigo","text-sm","font-bold","uppercase"],[1,"text-right"],[1,"bg-quicksilver","rounded-md","font-bold","text-white","text-base","border","anim","px-5","py-2","uppercase",3,"ngClass"],[1,"icon-live","mr-3"],[1,"capitalize","text-magicPotion","font-semibold","pt-5",3,"ngClass"],[1,"flex","justify-between","pt-4"],[1,"flex","items-center","space-x-1"],[3,"ngModel","readonly","cancel","ngModelChange"],[1,"text-quicksilver","text-xs","font-bold","pl-2"],[1,"flex","space-x-2"],["href","javascript:void(0);",1,"bg-brightGray","px-2","py-1","text-center","rounded"],[1,"icon-show","text-base","text-japaneseIndigo"],["href","javascript:void(0);",1,"bg-brightGray","px-2","py-1","text-center","rounded",3,"click"],[1,"icon-edit","text-base","text-japaneseIndigo"],[1,"icon-delete_fill","text-base","text-japaneseIndigo"],[1,"flex","flex-wrap","items-center","justify-center"],[3,"rows","totalRecords","rowsPerPageOptions","onPageChange"],[1,"bg-white","rounded-md","text-center","p-9","space-y-2"],[1,"w-full"],[1,"absolute","inset-0","text-white","flex","items-center"],[1,"mx-auto",3,"diameter","mode"]],template:function(t,i){1&t&&(e.YNc(0,Q,1,3,"p-progressSpinner",0),e.TgZ(1,"div",1)(2,"div",2)(3,"h2"),e._uU(4,"Live Stream"),e.qZA(),e.TgZ(5,"div",3)(6,"button",4),e._UZ(7,"i",5),e._uU(8,"Create New"),e.qZA()()(),e.TgZ(9,"div",6),e.YNc(10,$,2,1,"div",7),e.YNc(11,W,2,4,"div",8),e.TgZ(12,"div",9),e._UZ(13,"img",10),e.qZA()(),e.YNc(14,K,5,0,"div",11),e.qZA(),e.TgZ(15,"modal",12)(16,"div",13)(17,"div",14)(18,"h3",15),e._uU(19,"Delete Live Stream"),e.qZA(),e.TgZ(20,"p",16),e._uU(21),e.qZA()(),e.TgZ(22,"div",17)(23,"button",18),e.NdJ("click",function(){return i.closeDeleteDialog()}),e._uU(24,"Cancel"),e.qZA(),e.TgZ(25,"div",19)(26,"button",20),e.NdJ("click",function(){return i.deleteLiveStream()}),e.TgZ(27,"span",21),e._uU(28,"Delete"),e.qZA()(),e.YNc(29,X,2,2,"div",22),e.qZA()()()()),2&t&&(e.Q6J("ngIf",i.isLoading),e.xp6(10),e.Q6J("ngIf",!i.isLoading),e.xp6(1),e.Q6J("ngIf",i.liveStreamObj&&(null==i.liveStreamObj?null:i.liveStreamObj.length)),e.xp6(3),e.Q6J("ngIf",!i.liveStreamObj||!(null!=i.liveStreamObj&&i.liveStreamObj.length)),e.xp6(1),e.Q6J("isCloseHidden",!0)("isTitleHidden",!0),e.xp6(6),e.hij("Are you sure you want to delete ",null==i.tmpLSObj?null:i.tmpLSObj.event_name,""),e.xp6(6),e.Q6J("ngClass",e.VKq(9,ee,i.isDeleteLoading)),e.xp6(2),e.Q6J("ngIf",i.isDeleteLoading))},dependencies:[m.rH,u.mk,u.sg,u.O5,v.JJ,v.On,T.G,P.z,U.Ou,L.D,O.iG,u.uU,F]}),n})();var ne=s(5004),q=s(5054);const ie=function(){return{width:"50px",height:"50px"}};function oe(n,l){1&n&&e._UZ(0,"p-progressSpinner",3),2&n&&e.Akn(e.DdM(2,ie))}function re(n,l){if(1&n){const t=e.EpF();e.TgZ(0,"button",22),e.NdJ("click",function(){e.CHM(t);const o=e.oxw(2);return e.KtG(o.onTabChange("attendee"))}),e._uU(1,"Attendee"),e.qZA()}if(2&n){const t=e.oxw(2);e.Tol(t.attendee?"active":"")}}function le(n,l){if(1&n){const t=e.EpF();e.TgZ(0,"button",22),e.NdJ("click",function(){e.CHM(t);const o=e.oxw(2);return e.KtG(o.onTabChange("reviews"))}),e._uU(1,"Reviews"),e.qZA()}if(2&n){const t=e.oxw(2);e.Tol(t.reviews?"active":"")}}function ae(n,l){if(1&n){const t=e.EpF();e.TgZ(0,"button",22),e.NdJ("click",function(){e.CHM(t);const o=e.oxw(2);return e.KtG(o.onTabChange("subscription"))}),e._uU(1,"Subscription"),e.qZA()}if(2&n){const t=e.oxw(2);e.Tol(t.subscription?"active":"")}}function se(n,l){if(1&n){const t=e.EpF();e.TgZ(0,"a",55),e.NdJ("click",function(){e.CHM(t);const o=e.oxw(2);return e.KtG(o.exportAttendees())}),e._uU(1,"Export"),e.qZA()}}function ce(n,l){if(1&n&&(e.TgZ(0,"div",73)(1,"h3",74),e._uU(2,"About Shop"),e.qZA(),e._UZ(3,"div",75),e.qZA()),2&n){const t=e.oxw(4);e.xp6(3),e.Q6J("innerHtml",null==t.liveStreamObj?null:t.liveStreamObj.event_description,e.oJD)}}function ue(n,l){if(1&n&&(e.TgZ(0,"div",81)(1,"div",82),e._UZ(2,"p-image",83),e.qZA()()),2&n){const t=l.$implicit,i=e.oxw(5);e.xp6(2),e.Q6J("src",null!=t&&t.url?i.constants.baseImageURL+t.url:i.constants.defaultImage)("preview",!0)}}function de(n,l){if(1&n){const t=e.EpF();e.TgZ(0,"div",76)(1,"div",34)(2,"h3",74),e._uU(3,"Photo"),e.qZA(),e.TgZ(4,"a",77),e.NdJ("click",function(){e.CHM(t);const o=e.oxw(4);return e.KtG(o.openImageAndVideoDialog(o.liveStreamObj.photos,!0,!1))}),e._uU(5,"View All"),e.qZA()(),e.TgZ(6,"div",78)(7,"div",79),e.YNc(8,ue,3,2,"div",80),e.qZA()()()}if(2&n){const t=e.oxw(4);e.xp6(8),e.Q6J("ngForOf",t.liveStreamObj.photos)}}function me(n,l){if(1&n){const t=e.EpF();e.TgZ(0,"div",85)(1,"div",86),e.NdJ("click",function(){const r=e.CHM(t).$implicit,a=e.oxw(5);return e.KtG(a.openImageAndVideoDialog([r],!1,!1,!0))}),e._UZ(2,"video",87),e.TgZ(3,"div",88),e._UZ(4,"i",89),e.qZA()()()}if(2&n){const t=l.$implicit,i=e.oxw(5);e.xp6(2),e.Q6J("src",null!=t&&t.url?i.constants.baseImageURL+t.url:i.constants.defaultImage,e.LSH)}}function ve(n,l){if(1&n){const t=e.EpF();e.TgZ(0,"div",76)(1,"div",34)(2,"h3",74),e._uU(3,"Videos"),e.qZA(),e.TgZ(4,"a",77),e.NdJ("click",function(){e.CHM(t);const o=e.oxw(4);return e.KtG(o.openImageAndVideoDialog(o.liveStreamObj.videos,!1,!1))}),e._uU(5,"View All"),e.qZA()(),e.TgZ(6,"div",78)(7,"div",79),e.YNc(8,me,5,1,"div",84),e.qZA()()()}if(2&n){const t=e.oxw(4);e.xp6(8),e.Q6J("ngForOf",t.liveStreamObj.videos)}}function pe(n,l){if(1&n&&(e.TgZ(0,"div",90)(1,"h5"),e._uU(2,"Company Details"),e.qZA(),e.TgZ(3,"div",91)(4,"h3",74),e._uU(5,"About Shop"),e.qZA(),e._UZ(6,"div",75),e.qZA()()),2&n){const t=e.oxw(4);e.xp6(6),e.Q6J("innerHtml",null==t.liveStreamObj||null==t.liveStreamObj.companydetail?null:t.liveStreamObj.companydetail.about,e.oJD)}}function ge(n,l){if(1&n&&(e.TgZ(0,"div",90)(1,"h3",74),e._uU(2,"Terms & Conditions"),e.qZA(),e.TgZ(3,"div",92),e._UZ(4,"div",75),e.qZA()()),2&n){const t=e.oxw(4);e.xp6(4),e.Q6J("innerHtml",null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.t_and_c,e.oJD)}}function _e(n,l){if(1&n&&(e.TgZ(0,"a",96),e._UZ(1,"img",97),e.qZA()),2&n){const t=e.oxw(5);e.Q6J("href",null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.facebook,e.LSH)}}function fe(n,l){if(1&n&&(e.TgZ(0,"a",96),e._UZ(1,"img",98),e.qZA()),2&n){const t=e.oxw(5);e.Q6J("href",null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.twitter,e.LSH)}}function he(n,l){if(1&n&&(e.TgZ(0,"a",96),e._UZ(1,"img",99),e.qZA()),2&n){const t=e.oxw(5);e.Q6J("href",null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.youtube,e.LSH)}}function be(n,l){if(1&n&&(e.TgZ(0,"a",96),e._UZ(1,"img",100),e.qZA()),2&n){const t=e.oxw(5);e.Q6J("href",null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.pinterest,e.LSH)}}function Se(n,l){if(1&n&&(e.TgZ(0,"a",96),e._UZ(1,"img",101),e.qZA()),2&n){const t=e.oxw(5);e.Q6J("href",null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.instagram,e.LSH)}}function xe(n,l){if(1&n&&(e.TgZ(0,"a",96),e._UZ(1,"img",102),e.qZA()),2&n){const t=e.oxw(5);e.Q6J("href",null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.linkedin,e.LSH)}}function Ze(n,l){if(1&n&&(e.TgZ(0,"div",29)(1,"span",93),e._uU(2,"Social Media"),e.qZA(),e.TgZ(3,"div",94),e.YNc(4,_e,2,1,"a",95),e.YNc(5,fe,2,1,"a",95),e.YNc(6,he,2,1,"a",95),e.YNc(7,be,2,1,"a",95),e.YNc(8,Se,2,1,"a",95),e.YNc(9,xe,2,1,"a",95),e.qZA()()),2&n){const t=e.oxw(4);e.xp6(4),e.Q6J("ngIf",""!=(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.facebook)),e.xp6(1),e.Q6J("ngIf",""!=(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.twitter)),e.xp6(1),e.Q6J("ngIf",""!=(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.youtube)),e.xp6(1),e.Q6J("ngIf",""!=(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.pinterest)),e.xp6(1),e.Q6J("ngIf",""!=(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.instagram)),e.xp6(1),e.Q6J("ngIf",""!=(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.linkedin))}}function we(n,l){if(1&n&&(e.TgZ(0,"div",45),e.YNc(1,ce,4,1,"div",68),e.TgZ(2,"div",69),e.YNc(3,de,9,1,"div",70),e.YNc(4,ve,9,1,"div",70),e.YNc(5,pe,7,1,"div",71),e.YNc(6,ge,5,1,"div",71),e.YNc(7,Ze,10,6,"div",72),e.TgZ(8,"div",40),e._UZ(9,"img",41),e.qZA()()()),2&n){const t=e.oxw(3);e.xp6(1),e.Q6J("ngIf",null==t.liveStreamObj?null:t.liveStreamObj.event_description),e.xp6(2),e.Q6J("ngIf",""!=t.liveStreamObj.photos),e.xp6(1),e.Q6J("ngIf",""!=t.liveStreamObj.videos),e.xp6(1),e.Q6J("ngIf",null==t.liveStreamObj||null==t.liveStreamObj.companydetail?null:t.liveStreamObj.companydetail.about),e.xp6(1),e.Q6J("ngIf",""!=(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.t_and_c)),e.xp6(1),e.Q6J("ngIf",(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.facebook)&&""!=(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.facebook)||(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.twitter)&&""!=(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.twitter)||(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.youtube)&&""!=(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.youtube)||(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.pinterest)&&""!=(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.pinterest)||(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.instagram)&&""!=(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.instagram)||(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.linkedin)&&""!=(null==t.liveStreamObj||null==t.liveStreamObj.tandc?null:t.liveStreamObj.tandc.linkedin))}}function Ie(n,l){1&n&&(e.TgZ(0,"div",45)(1,"div",103)(2,"div",104)(3,"div",105)(4,"div",106)(5,"div",43),e._uU(6,"Reynaldo Franklin"),e.qZA()()(),e.TgZ(7,"a",107),e._uU(8,"Attend"),e.qZA()(),e.TgZ(9,"div",104)(10,"div",105)(11,"div",106)(12,"div",43),e._uU(13,"Reynaldo Franklin"),e.qZA()()(),e.TgZ(14,"a",107),e._uU(15,"Attend"),e.qZA()(),e.TgZ(16,"div",104)(17,"div",105)(18,"div",106)(19,"div",43),e._uU(20,"Reynaldo Franklin"),e.qZA()()(),e.TgZ(21,"a",107),e._uU(22,"Attend"),e.qZA()(),e.TgZ(23,"div",104)(24,"div",105)(25,"div",106)(26,"div",43),e._uU(27,"Reynaldo Franklin"),e.qZA()()(),e.TgZ(28,"a",107),e._uU(29,"Attend"),e.qZA()()()())}function Te(n,l){if(1&n&&(e.TgZ(0,"div",56)(1,"div",57),e.YNc(2,we,10,6,"div",58),e.YNc(3,Ie,30,0,"div",58),e.TgZ(4,"div",59)(5,"div",60)(6,"div")(7,"span",61),e._UZ(8,"i",62),e._uU(9," Date"),e.qZA(),e.TgZ(10,"p",63),e._uU(11),e.ALo(12,"date"),e.qZA()(),e.TgZ(13,"div")(14,"span",61),e._UZ(15,"i",64),e._uU(16," Time"),e.qZA(),e.TgZ(17,"p",65),e._uU(18),e.ALo(19,"convertFrom24To12Format"),e.ALo(20,"convertFrom24To12Format"),e.qZA()()(),e.TgZ(21,"div",60)(22,"div",66)(23,"div",4)(24,"span",61),e._uU(25,"Join User Link"),e.qZA(),e.TgZ(26,"p",63),e._uU(27,"http://Join User Link"),e.qZA()(),e.TgZ(28,"div",4),e._UZ(29,"a",67),e.qZA()(),e.TgZ(30,"div",66)(31,"div",4)(32,"span",61),e._uU(33,"Organiser / Media Connect Link"),e.qZA(),e.TgZ(34,"p",63),e._uU(35,"http://Join User Link"),e.qZA()(),e.TgZ(36,"div",4),e._UZ(37,"a",67),e.qZA()()()()()()),2&n){const t=e.oxw(2);e.Tol(t.reviews||t.subscription?"":"active"),e.xp6(2),e.Q6J("ngIf",t.overview),e.xp6(1),e.Q6J("ngIf",t.attendee),e.xp6(8),e.Oqu(e.xi3(12,7,null==t.liveStreamObj?null:t.liveStreamObj.event_date,"dd MMM, yyyy")),e.xp6(7),e.AsE("",e.lcZ(19,10,null==t.liveStreamObj?null:t.liveStreamObj.event_start_time)," - ",e.lcZ(20,12,null==t.liveStreamObj?null:t.liveStreamObj.event_end_time),"")}}function Oe(n,l){if(1&n){const t=e.EpF();e.TgZ(0,"div",4)(1,"div",5),e._UZ(2,"img",6),e.qZA(),e.TgZ(3,"div",7)(4,"div",8)(5,"div")(6,"h2",9),e._uU(7),e.qZA(),e.TgZ(8,"div",10)(9,"div",11)(10,"p-rating",12),e.NdJ("ngModelChange",function(o){e.CHM(t);const r=e.oxw();return e.KtG(r.liveStreamObj.ratings=o)}),e.qZA()()(),e.TgZ(11,"span",13),e._uU(12),e.qZA()(),e.TgZ(13,"div",14)(14,"button",15),e._UZ(15,"i",16),e.TgZ(16,"span",17),e._uU(17,"go live "),e.qZA()(),e.TgZ(18,"div",18)(19,"a",19),e.NdJ("click",function(o){e.CHM(t);const r=e.oxw();return e.KtG(r.editEvent(o,r.liveStreamObj._id))}),e._UZ(20,"i",20),e.qZA()()()(),e.TgZ(21,"div",21)(22,"button",22),e.NdJ("click",function(){e.CHM(t);const o=e.oxw();return e.KtG(o.onTabChange("overview"))}),e._uU(23,"Overview"),e.qZA(),e.YNc(24,re,2,2,"button",23),e.YNc(25,le,2,2,"button",23),e.YNc(26,ae,2,2,"button",23),e.YNc(27,se,2,0,"a",24),e.qZA(),e.TgZ(28,"div",25),e.YNc(29,Te,38,14,"div",26),e.TgZ(30,"div",27)(31,"div",28)(32,"div",29)(33,"div",30)(34,"div")(35,"div",31),e._UZ(36,"img",32),e.qZA()(),e.TgZ(37,"div",33)(38,"div",34)(39,"h5"),e._uU(40,"Charlotte"),e.qZA(),e.TgZ(41,"div",35)(42,"span",36),e._uU(43,"19 Jan, 2022"),e.qZA(),e._UZ(44,"i",37)(45,"i",37)(46,"i",37)(47,"i",37)(48,"i",38),e.qZA()(),e.TgZ(49,"p",39),e._uU(50,"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodoligula eget dolor."),e.qZA()()(),e.TgZ(51,"div",30)(52,"div")(53,"div",31),e._UZ(54,"img",32),e.qZA()(),e.TgZ(55,"div",33)(56,"div",34)(57,"h5"),e._uU(58,"Charlotte"),e.qZA(),e.TgZ(59,"div",35)(60,"span",36),e._uU(61,"19 Jan, 2022"),e.qZA(),e._UZ(62,"i",37)(63,"i",37)(64,"i",37)(65,"i",37)(66,"i",38),e.qZA()(),e.TgZ(67,"p",39),e._uU(68,"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodoligula eget dolor."),e.qZA()()()(),e.TgZ(69,"div",40),e._UZ(70,"img",41),e.qZA()()(),e.TgZ(71,"div",42)(72,"div",34)(73,"div",43),e._uU(74,"Subscription Plan Details"),e.qZA(),e.TgZ(75,"button",44),e._uU(76,"purchase new plan"),e.qZA()(),e.TgZ(77,"div",45)(78,"div",46)(79,"div",4)(80,"div",47),e._uU(81,"Subscription Plan Name 1"),e.qZA(),e.TgZ(82,"p",48),e._uU(83,"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."),e.qZA()(),e.TgZ(84,"div",49)(85,"div",47),e._uU(86,"join live streaming user limitations"),e.qZA(),e.TgZ(87,"p",48),e._uU(88,"250 User join this streaming "),e.qZA()(),e.TgZ(89,"div",49)(90,"div",47),e._uU(91,"Price"),e.qZA(),e.TgZ(92,"p",48),e._uU(93,"$ 300"),e.qZA()(),e._UZ(94,"hr",50),e.TgZ(95,"div",34)(96,"div",4)(97,"div",47),e._uU(98,"Transaction Date & Time"),e.qZA(),e.TgZ(99,"p",48),e._uU(100,"21 April 2022, 12:15 pm"),e.qZA()(),e.TgZ(101,"button",51),e._UZ(102,"i",52),e._uU(103," download invoice"),e.qZA()(),e.TgZ(104,"div",49)(105,"div",47),e._uU(106,"Transaction Id"),e.qZA(),e.TgZ(107,"p",48),e._uU(108,"0123654896"),e.qZA()(),e.TgZ(109,"div",49)(110,"div",47),e._uU(111,"Price"),e.qZA(),e.TgZ(112,"p",48),e._uU(113,"$ 300"),e.qZA()(),e.TgZ(114,"div",49)(115,"div",47),e._uU(116,"Payment Status"),e.qZA(),e.TgZ(117,"p",53),e._uU(118,"Successful"),e.qZA()()(),e.TgZ(119,"div",46)(120,"div",4)(121,"div",47),e._uU(122,"Subscription Plan Name 1"),e.qZA(),e.TgZ(123,"p",48),e._uU(124,"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."),e.qZA()(),e.TgZ(125,"div",49)(126,"div",47),e._uU(127,"join live streaming user limitations"),e.qZA(),e.TgZ(128,"p",48),e._uU(129,"250 User join this streaming "),e.qZA()(),e.TgZ(130,"div",49)(131,"div",47),e._uU(132,"Price"),e.qZA(),e.TgZ(133,"p",48),e._uU(134,"$ 300"),e.qZA()(),e._UZ(135,"hr",50),e.TgZ(136,"div",34)(137,"div",4)(138,"div",47),e._uU(139,"Transaction Date & Time"),e.qZA(),e.TgZ(140,"p",48),e._uU(141,"21 April 2022, 12:15 pm"),e.qZA()(),e.TgZ(142,"button",51),e._UZ(143,"i",52),e._uU(144," download invoice"),e.qZA()(),e.TgZ(145,"div",49)(146,"div",47),e._uU(147,"Transaction Id"),e.qZA(),e.TgZ(148,"p",48),e._uU(149,"0123654896"),e.qZA()(),e.TgZ(150,"div",49)(151,"div",47),e._uU(152,"Price"),e.qZA(),e.TgZ(153,"p",48),e._uU(154,"$ 300"),e.qZA()(),e.TgZ(155,"div",49)(156,"div",47),e._uU(157,"Payment Status"),e.qZA(),e.TgZ(158,"p",53),e._uU(159,"Successful"),e.qZA()()()(),e._UZ(160,"div",54),e.TgZ(161,"div",40),e._UZ(162,"img",41),e.qZA()()()()()}if(2&n){const t=e.oxw();e.xp6(2),e.Q6J("src",null!=t.liveStreamObj&&null!=t.liveStreamObj.photos[0]&&t.liveStreamObj.photos[0].url?t.constants.baseImageURL+t.liveStreamObj.photos[0].url:t.constants.defaultImage,e.LSH),e.xp6(5),e.Oqu(null==t.liveStreamObj?null:t.liveStreamObj.event_name),e.xp6(3),e.Q6J("ngModel",t.liveStreamObj.ratings)("readonly",!0)("cancel",!1),e.xp6(2),e.hij("",null==t.liveStreamObj?null:t.liveStreamObj.event_type," live streaming"),e.xp6(10),e.Tol(t.overview?"active":""),e.xp6(2),e.Q6J("ngIf",null==t.liveStreamObj||null==t.liveStreamObj.attendee?null:t.liveStreamObj.attendee.length),e.xp6(1),e.Q6J("ngIf",null==t.liveStreamObj||null==t.liveStreamObj.reviews?null:t.liveStreamObj.reviews.length),e.xp6(1),e.Q6J("ngIf",null==t.liveStreamObj||null==t.liveStreamObj.subscription?null:t.liveStreamObj.subscription.length),e.xp6(1),e.Q6J("ngIf",(null==t.liveStreamObj||null==t.liveStreamObj.reviews?null:t.liveStreamObj.reviews.length)&&t.attendee),e.xp6(2),e.Q6J("ngIf",!t.reviews&&!t.subscription),e.xp6(1),e.Tol(t.reviews?"active":""),e.xp6(41),e.Tol(t.subscription?"active":"")}}function Ce(n,l){if(1&n){const t=e.EpF();e.TgZ(0,"app-image-and-video-preview",108),e.NdJ("openClosePopup",function(o){e.CHM(t);const r=e.oxw();return e.KtG(r.closePop(o))}),e.qZA()}if(2&n){const t=e.oxw();e.Q6J("isSingleVideo",t.isSingleVideo)("isImageOrVideoFlag",t.isImage)("isCompanyImagesAndVideo",t.companyIAndV)("expectedProp",t.imagesOrVideosArr)}}let Ae=(()=>{class n{constructor(t,i,o,r){this._globalFunctions=t,this._activatedRoute=i,this._router=o,this._liveStreamService=r,this.liveStreamObj=[],this.constants=Z.t,this.isLoading=!1,this.isExportLoading=!1,this.isOpenPopup=!1,this.isImage=!1,this.isSingleVideo=!1,this.companyIAndV=!1,this.imagesOrVideosArr=[],this.overview=!0,this.attendee=!1,this.reviews=!1,this.subscription=!1,this.zoom=Z.t.defaultMapZoom,this.lat=0,this.lng=0}ngOnInit(){this._router.events.subscribe(t=>{t instanceof m.OD&&setTimeout(()=>{const i=localStorage.getItem("accessToken");i&&""!=i&&this.getLiveStreamObj()},0)}),this.getLiveStreamObj()}getLiveStreamObj(){this.isLoading=!0;const t=this._activatedRoute.snapshot.paramMap.get("id");this._liveStreamService.getLiveStreamById(t).subscribe(i=>{this.liveStreamObj=i.Data,setTimeout(()=>{this._globalFunctions.loadAccordion()},0),this.isLoading=!1},i=>{this._globalFunctions.errorHanding(i,this,!0),this.isLoading=!1})}onTabChange(t){this.overview=this.attendee=this.reviews=this.subscription=!1,"overview"==t?this.overview=!0:"attendee"==t?this.attendee=!0:"reviews"==t?this.reviews=!0:"subscription"==t&&(this.subscription=!0)}exportAttendees(){}openImageAndVideoDialog(t,i,o,r=!1){this.imagesOrVideosArr=t,this.isImage=i,this.companyIAndV=o,this.isSingleVideo=r,this.isOpenPopup=!0}closePop(t){this.isOpenPopup=t}editEvent(t,i){t.stopPropagation(),localStorage.setItem("lsId",i),this._router.navigate(["/live-stream/create/stream"])}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(w.E),e.Y36(m.gz),e.Y36(m.F0),e.Y36(j))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-stream-overview"]],decls:3,vars:3,consts:[["animationDuration",".5s","strokeWidth","8","class","absolute bg-white bg-opacity-25 backdrop-blur-sm inset-x-0 top-0 h-full w-full z-40","styleClass","custom-spinner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",3,"style",4,"ngIf"],["class","",4,"ngIf"],[3,"isSingleVideo","isImageOrVideoFlag","isCompanyImagesAndVideo","expectedProp","openClosePopup",4,"ngIf"],["animationDuration",".5s","strokeWidth","8","styleClass","custom-spinner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",1,"absolute","bg-white","bg-opacity-25","backdrop-blur-sm","inset-x-0","top-0","h-full","w-full","z-40"],[1,""],[1,"-mt-12","relative","-z-10"],["alt","cooking-together-bg",1,"w-full","object-cover","max-h-80",3,"src"],[1,"wrapper","-mt-14","z-10"],[1,"flex","justify-between","bg-white","py-5","px-7","rounded-md"],[1,"pb-2","lg:pb-2"],[1,"w-full","flex","flex-wrap","space-y-2","xl:space-y-0"],[1,"pr-2.5","lg:pr-5"],[3,"ngModel","readonly","cancel","ngModelChange"],[1,"bg-caribbeanGreen","bg-opacity-20","font-bold","px-2","text-caribbeanGreen","text-sm","capitalize","p-1","inline-block","mt-5"],[1,"space-y-10","flex","flex-col","justify-between","items-end"],[1,"bg-quicksilver","text-white","font-bold","rounded-lg","capitalize","px-3","py-2"],[1,"icon-live"],[1,"pl-2.5","whitespace-nowrap"],[1,"flex","justify-end","space-x-2"],["href","javascript:void(0);",1,"bg-brightGray","px-2","py-1","text-center","rounded",3,"click"],[1,"icon-edit","text-base","text-black"],[1,"teb-holder"],["type","button",3,"click"],["type","button",3,"class","click",4,"ngIf"],["class","secondary px-5 py-2 flex items-end rounded-sm max-w-max ml-auto","href","javascript:void(0);",3,"click",4,"ngIf"],[1,"pt-3.5","lg:pt-7"],["class","relative tab-main active",3,"class",4,"ngIf"],["id","Comment",1,"w-full","space-y-7","tab-main"],[1,"w-full","space-y-2"],[1,"w-full","space-y-3"],[1,"bg-white","rounded-lg","p-7","lg:flex"],[1,"w-20","h-20"],["src","../assets/images/profile-2.png","alt","Profile"],[1,"lg:px-5","py-5","lg:py-0"],[1,"flex","justify-between","items-center"],[1,"flex","items-center","space-x-1","pt-1.5","pb-2.5"],[1,"text-xs","font-bold","text-quicksilver","mr-4"],[1,"icon-rating","text-[#F8DA48]"],[1,"icon-rating","text-quicksilver"],[1,"text-sm","text-japaneseIndigo","pt-4"],[1,"w-full","mt-5","addsBox"],["src","/assets/images/banner-ads.png","alt","ring-ad",1,"w-full","object-cover"],["id","Subscription",1,"w-full","space-y-7","tab-main"],[1,"text-lg","font-bold","text-japaneseIndigo"],[1,"secondary","capitalize","px-5","py-2","anim"],[1,"w-full","lg:w-8/12","lg:pr-5","space-y-7"],[1,"bg-white","p-8","rounded-lg","capitalize"],[1,"text-base","font-bold","text-japaneseIndigo"],[1,"text-quicksilver","text-sm","leading-6","font-normal","pt-2"],[1,"pt-5"],[1,"my-5"],[1,"text-quicksilver","font-bold","text-base","border","border-quicksilver","rounded-lg","capitalize","px-5","py-2"],[1,"icon-download","text-quicksilver","font-extrabold","mr-2"],[1,"text-caribbeanGreen","text-sm","leading-6","font-normal","pt-2"],[1,"w-full","lg:w-4/12","lg:pr-5"],["href","javascript:void(0);",1,"secondary","px-5","py-2","flex","items-end","rounded-sm","max-w-max","ml-auto",3,"click"],[1,"relative","tab-main","active"],[1,"flex","flex-wrap"],["class","w-full lg:w-8/12 lg:pr-5 space-y-7",4,"ngIf"],[1,"w-full","lg:w-4/12","lg:pl-5","space-y-7","pt-5","lg:pt-0"],[1,"rounded-md","bg-white","p-8","space-y-6"],[1,"text-quicksilver","text-xs","font-bold"],[1,"icon-calendar"],[1,"text-sm","font-bold","text-japaneseIndigo"],[1,"icon-time"],[1,"text-sm","font-bold","text-japaneseIndigo","uppercase"],[1,"flex","w-full","justify-between"],["href","javascript:void(0);",1,"icon-copy","text-quicksilver","text-xl"],["class","p-7 bg-white rounded-md space-y-2",4,"ngIf"],[1,"space-y-2.5"],["class","media-upload-holder",4,"ngIf"],["class","space-y-4",4,"ngIf"],["class","w-full space-y-3",4,"ngIf"],[1,"p-7","bg-white","rounded-md","space-y-2"],[1,"text-lg"],[3,"innerHtml"],[1,"media-upload-holder"],["href","javascript:void(0);",1,"text-spiroDiscoBall","text-sm","font-bold","opacity-60","hover:text-red-500",3,"click"],[1,"w-full"],[1,"flex","flex-wrap","-mx-2"],["class","w-full lg:w-2/12 p-2 ov-p",4,"ngFor","ngForOf"],[1,"w-full","lg:w-2/12","p-2","ov-p"],[1,"rounded","relative","overflow-hidden","bg-white","h-24"],["imageClass","w-full h-full object-cover rounded","styleClass","w-full h-full",3,"src","preview"],["class","w-full lg:w-1/5 p-2 ov-p group hover:bg-slate-100",4,"ngFor","ngForOf"],[1,"w-full","lg:w-1/5","p-2","ov-p","group","hover:bg-slate-100"],[1,"rounded","relative","overflow-hidden","h-28","cursor-pointer",3,"click"],[1,"w-full","h-full","object-cover","bg-white",3,"src"],[1,"opacity-0","bg-black","bg-opacity-50","flex","items-center","justify-center","group-hover:opacity-100","absolute","inset-0","transition-all","duration-300"],[1,"pi","pi-eye","text-2xl","text-white"],[1,"space-y-4"],[1,"p-7","bg-white","rounded-md","space-y-1"],[1,"p-3.5","xl:p-5","bg-white","rounded-md"],[1,"block","text-base","lg:text-xl","font-bold"],[1,"flex","items-center","space-x-5","p-5","lg:p-7","bg-white","rounded-lg"],["target","_blank",3,"href",4,"ngIf"],["target","_blank",3,"href"],["alt","facebook","src","../assets/images/facebook.png",1,"w-10","h-10","object-cover"],["alt","twiiter","src","../assets/images/twiiter.png",1,"w-10","h-10","object-cover"],["alt","youtube","src","../assets/images/youtube.png",1,"w-10","h-10","object-cover"],["alt","pinterest","src","../assets/images/pinterest.png",1,"w-10","h-10","object-cover"],["alt","instagram","src","../assets/images/instagram.png",1,"w-10","h-10","object-cover"],["alt","linkdin","src","../assets/images/linked.png",1,"w-10","h-10","object-cover"],[1,"w-full","space-y-2.5"],[1,"bg-white","px-5","py-2.5","flex","justify-between","items-center","rounded-md"],[1,"space-y-2"],[1,"flex","items-center","space-x-3"],["href","javascript:void(0);",1,"text-lg","font-bold","text-magicPotion"],[3,"isSingleVideo","isImageOrVideoFlag","isCompanyImagesAndVideo","expectedProp","openClosePopup"]],template:function(t,i){1&t&&(e.YNc(0,oe,1,3,"p-progressSpinner",0),e.YNc(1,Oe,163,17,"div",1),e.YNc(2,Ce,1,4,"app-image-and-video-preview",2)),2&t&&(e.Q6J("ngIf",i.isLoading),e.xp6(1),e.Q6J("ngIf",i.liveStreamObj&&!i.isLoading),e.xp6(1),e.Q6J("ngIf",i.isOpenPopup))},dependencies:[u.sg,u.O5,v.JJ,v.On,ne.T,T.G,q.E,O.iG,u.uU,F]}),n})();var ye=s(3474),je=s(5505),Ue=s(585),N=s(3238);s(9646),s(2843),s(4128),s(8505),s(4004),s(262),s(8746),s(3099),s(1481);let Pe=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[N.BQ,N.BQ]}),n})();const He=[{path:"",component:te},{path:":id",component:Ae},{path:"create",loadChildren:()=>s.e(195).then(s.bind(s,195)).then(n=>n.CreateStreamModule)}];let Qe=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[m.Bz.forChild(He),u.ez,Ue._8,v.UX,je.m,ye.z,U.Cq,T.L,L.U,q.$,O.Xt,Pe]}),n})()}}]);