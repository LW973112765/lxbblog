<template>
    <div class="main">
      <div id="_page"
	style="margin: 0px auto; background: rgb(255, 255, 255); width: 148mm; height: 200mm; transform: scale(1, 1); transform-origin: 50% 0px 0px;"
	pagekind="A5" direct="portrait">
	
	<div id="_header"
		style="outline: none; min-height: 0.65cm; padding-left: 0.41cm; padding-right: 0.36cm; padding-top: 0.65cm; position: relative;"
		contenteditable="false" class="">
		<p style=" font-family: 宋体; font-size: 12pt;">
		</p>
	</div>

	<div id="_body"
		style="outline:none;min-height: calc(210mm - 0.65cm - 0cm - 0.65cm - 1.98cm);padding-left:0.41cm;padding-right:0.36cm;"
		contenteditable="false">
		<p style=" font-family: 宋体; font-size: 12pt; text-align: Center;">
		</p>
		<p style=" font-family: 宋体; font-size: 12pt; text-align: Center;">
			<label
				style=" font-family: 宋体; font-size: 15.75pt; font-weight: bold; text-align: Center;">云南城投昆明妇女儿童医院</label>
		</p>
		<p style=" font-family: 宋体; font-size: 12pt; text-align: Center;">
			<label style=" font-family: 宋体; font-size: 14.25pt; font-weight: bold;">中医门诊病历</label>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;"></p>
		<hr>
		<label style=" font-family: 宋体; font-size: 10.5pt;">姓名:</label>
		<a tabindex="0" id="patientName" name="姓名" class="" style=" font-family: 宋体; font-size: 10.5pt;"
			 type="Text" value="" placeholder="{姓名}" >{{ data.name }}</a>
		<label style=" font-family: 宋体; font-size: 10.5pt;"> 性别:</label>
		<a tabindex="0" id="sex" name="性别" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
			 type="Text" value="" placeholder="{性别}">{{ data.sex }}</a>
		<label style=" font-family: 宋体; font-size: 10.5pt;"> 年龄:</label>
		<a tabindex="0" id="age" name="年龄" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
			 type="Text" value="" placeholder="{年龄}">{{ data.age }}</a>
		<label style=" font-family: 宋体; font-size: 10.5pt;"> 病历号:</label>
		<a tabindex="0" id="blh" name="病历号" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
			 type="Text" value="" placeholder="{病历号}">{{ data.Medical_record_number }}</a>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">民族:</label>
			<a tabindex="0" id="field25" name="民族" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{民族}">{{ data.national }}</a>
			<label style=" font-family: 宋体; font-size: 10.5pt;"> 婚况:</label>
			<a tabindex="0" id="field26" name="婚况" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{婚况}">{{ data.Marital_status }}</a>
			<label style=" font-family: 宋体; font-size: 10.5pt;"> 职业:</label>
			<a tabindex="0" id="field27" name="职业" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{职业}">{{ data.occupation }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">工作单位：</label>
			<a tabindex="0" id="field29" name="工作单位" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{工作单位}">{{ data.workplace }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">电话：</label>
			<a tabindex="0" id="field30" name="电话" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{电话}">{{ data.phone }}</a>
			<label style=" font-family: 宋体; font-size: 10.5pt;">        家庭住址：</label>
			<a tabindex="0" id="field31" name="家庭住址" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{家庭住址}">{{ data.address }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">就诊科室:</label>
			<a tabindex="0" id="ks" name="科室" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{科室}">{{ data.Visiting_department }}</a>
			<label style=" font-family: 宋体; font-size: 10.5pt;">     就诊日期:</label>
			<a tabindex="0" id="datetime" name="日期" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{就诊时间}">{{ data.Visiting_date }}</a>
			<label style=" font-family: 宋体; font-size: 10.5pt;"> </label>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt; text-align: Center;">
			<label style=" font-family: 宋体; font-size: 10.5pt; font-weight: bold;">（</label>
			<a tabindex="0" id="field32" class=" " style=" font-family: 宋体; font-size: 10.5pt; font-weight: bold;"
				type="DropdownList"
				data="[{&quot;Text&quot;:&quot;初&quot;,&quot;Value&quot;:{}},{&quot;Text&quot;:&quot;复&quot;,&quot;Value&quot;:{}}]"
				value="初" placeholder="初">初</a>
			<label style=" font-family: 宋体; font-size: 10.5pt; font-weight: bold;">）诊记录</label>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt; font-weight: bold;">问诊</label>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">主诉:</label>
			<a tabindex="0" id="zs" name="主诉" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{主诉}">{{ data.Complaints }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">现病史:</label>
			<a tabindex="0" id="xbs" name="现病史" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{现病史}">{{ data.History_of_present_illness }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">刻下症：</label>
			<a tabindex="0" id="field37" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="刻下症">{{data.Engraving_the_disease}}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">既往史:</label>
			<a tabindex="0" id="jws" name="既往史" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{既往史}">{{ data.Anamnesis }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">过敏史：</label>
			<a tabindex="0" id="gms" name="过敏史" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{过敏史}">{{ data.History_of_allergies }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">辅助检查：</label>
			<a tabindex="0" id="tgjc" name="辅助检查" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="辅助检查">{{ data.Ancillary_examination }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt; font-weight: bold;">望闻切诊</label>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">望诊:</label>
			<a tabindex="0" id="field23" name="望诊" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{望诊}">{{ data.Visit }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">闻诊:</label>
			<a tabindex="0" id="field24" name="闻诊" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{闻诊}">{{ data.Sniff }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">切诊：</label>
			<a tabindex="0" id="field28" name="切诊" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{切诊}">{{ data.Incision }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">今日节气:</label>
			<a tabindex="0" id="field33" name="今日节气" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{今日节气}">{{ data.Solar_terms_today }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">辩证分析:</label>
			<a tabindex="0" id="field34" name="辩证分析" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{辩证分析}">{{ data.Dialectical_analysis }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt; font-weight: bold;">诊断</label>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">中医诊断:</label>
			<a tabindex="0" id="diagNameChn" name="中医诊断" class="blank "
				style=" font-family: 宋体; font-size: 10.5pt;"  type="Text" value=""
				placeholder="{中医诊断}">{{ data.TCM_diagnosis }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">西医诊断:</label>
			<a tabindex="0" id="diagNameWest" name="西医诊断" class="blank "
				style=" font-family: 宋体; font-size: 10.5pt;"  type="Text" value=""
				placeholder="{西医诊断}">{{ data.Western_medical_diagnosis }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt; font-weight: bold;">治法</label>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt; ">治疗建议:</label>
			<a tabindex="0" id="field36" class="blank "
				style=" font-family: 宋体; font-size: 10.5pt; "  type="Text"
				value="" placeholder="">{{ data.Treatment }}</a>
		</p>

		<p style=" font-family: 宋体; font-size: 10.5pt;">
			<label style=" font-family: 宋体; font-size: 10.5pt;">医嘱：</label>
			<a tabindex="0" id="czyj" name="医嘱" class="blank " style=" font-family: 宋体; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{医嘱}">{{ data.Orders }}</a>
		</p>
		<p style=" font-family: 宋体; font-size: 10.5pt; text-align: Right;">
			<label style=" font-family: 仿宋; font-size: 10.5pt; font-weight: bold;">医生签名:</label>
			<a tabindex="0" id="signImage" name="医生姓名" class="blank " style=" font-family: 仿宋; font-size: 10.5pt;"
				 type="Text" value="" placeholder="{医生签名}">{{ data.signature }}</a>
			<label style=" font-family: 仿宋; font-size: 14.25pt; text-align: Right;"> </label>
		</p>
	</div>

	<div id="_footer"
		style="outline:none; position:relative;min-height:1.98cm;padding-left:0.41cm;padding-right:0.36cm;padding-bottom:5cm;margin-top: -3.5cm;"
		contenteditable="false" class="">
		<p style=" font-family: 宋体; font-size: 12pt;">
			<label
				style=" font-family: 宋体; font-size: 10.5pt; color: #323232;">云南城投昆明妇女儿童医院                                         </label>
		</p>
	</div>

         </div>
         <div class="download">
		<div  @click="downloadHtmlToPdf(data.name)"><img width="50px" height="50px" src="./02.png" alt="">导出为pdf</div>
	</div>
    </div>
  </template>
   <script>
   import moment from "moment";
   import { mapState } from "vuex";
   export default {
     name: "RecordDetail",
     data() {
       return {
       printObj: {
         id: "_page",       // 上面绑定的id名字
         popTitle: '标题名字',    // 需要显示的标题名字
         extraCss: 'https://www.google.com,https://www.google.com',
         extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
       },
       data: [],
 
       };
     },
     mounted() {
     },
     computed: {
    ...mapState("loginModule", ["userinfo"]),
  },
     methods: {
          GetMyrecord() {
            this.$api
          .GetMyrecord({
            username:this.userinfo.username
          })
          .then((res) => {
            if (res.data.status === 200) {
              console.log(res.data.data,'res.data.data');
              res.data.data.forEach((data) => {
                data.Visiting_date = moment(data.Visiting_date).format(
                  "YYYY-MM-DD HH:mm:ss"
                    );
              });
              this.data = res.data.data[0];
            }
          });
       }
   },
     created() {
      this.GetMyrecord()
      //  console.log(this.$route.query, '郎伟');
    //  this.data.Visiting_date=moment(this.data.Visiting_date).format(
    //              "YYYY-MM-DD"
    //            );
     },
   };
   </script>
   
   <style lang="less" scoped>
 a{
   color: #999!important;
 }
 label{
 font-size: 900;
 
 }
 
   .header {
     margin-top: 300px;
     display: flex;
     // background-color: rgba(0, 0, 0, 0);
     button {
       margin-left: 20px;
       margin-right: 0px;
     }
   }
   button:hover {
     color: aqua;
   }
   .warpper {
     margin-top: 10px;
   }
   .user {
   position: relative;
     padding-left: 27px;
     padding-right: 5px;
   // padding-bottom: 20px;
     width: 95%;
   }
   .main {
     margin-top: -5px;
     background-color: white;
   }
   .download{
   position: absolute;
   font-size: 20px;
   left: 20px;
bottom: 20px;
   div{
     margin-bottom: 30px;
     background-color: aqua;
     border-radius: 5px;
     cursor: pointer;
     padding: 5px;
   }
   img{
     vertical-align: middle;
   }
   }
   .ret{
   text-align: center;
   }
   </style>