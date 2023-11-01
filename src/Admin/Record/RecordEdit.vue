<template>
    <div class="main">
      <el-form
        :model="data"
        status-icon
        :rules="rules"
        ref="data"
        label-width="100px"
        label-height="100px"
        class="demo-data"
      >
        <el-form-item v-if="!data.id" label="用户名" prop="username">
          <el-input
            type="text"
            v-model="data.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input
            type="text"
            v-model="data.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio text="radio" v-model="data.sex" label="男">男</el-radio>
          <el-radio text="radio" v-model="data.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="data.age"></el-input>
        </el-form-item>
        <el-form-item label="病历号" prop="Medical_record_number">
          <el-input  type="text" v-model="data.Medical_record_number"></el-input>
        </el-form-item>
        <el-form-item label="民族" prop="national">
          <el-input  type="text" v-model="data.national"></el-input>
        </el-form-item>
        <el-form-item label="婚况" prop="Marital_status">
          <el-input v-model="data.Marital_status">
        </el-input>
        </el-form-item><el-form-item label="职业" prop="occupation">
          <el-input  type="text" v-model="data.occupation">
        </el-input>
        </el-form-item><el-form-item label="工作单位" prop="workplace">
          <el-input  type="text" v-model="data.workplace">
        </el-input>
        </el-form-item><el-form-item label="电话" prop="phone">
          <el-input  type="number" v-model="data.phone">
        </el-input>
        </el-form-item><el-form-item label="家庭住址" prop="address">
          <el-input  type="text" v-model="data.address">
        </el-input>
        </el-form-item><el-form-item label="就诊科室" prop="Visiting_department">
          <el-input  type="text" v-model="data.Visiting_department ">
        </el-input>
        </el-form-item><el-form-item label="就诊日期" prop="Visiting_date">
          <el-input type="date" v-model="data.Visiting_date">
        </el-input>
        </el-form-item><el-form-item label="主诉" prop="Complaints">
          <el-input type="text" v-model="data.Complaints">
        </el-input>
        </el-form-item><el-form-item label="现病史" prop="History_of_present_illness">
          <el-input  type="text" v-model="data.History_of_present_illness">
        </el-input>
        </el-form-item>
        <el-form-item label="刻下症" prop="Engraving_the_disease">
          <el-input  type="text" v-model="data.Engraving_the_disease">
        </el-input>
        </el-form-item>
        <el-form-item label="既往史" prop="Anamnesis">
          <el-input  type="text" v-model="data.Anamnesis">
        </el-input>
        </el-form-item>
        <el-form-item label="过敏史" prop="History_of_allergies">
          <el-input  type="text" v-model="data.History_of_allergies">
        </el-input>
        </el-form-item>
        <el-form-item label="辅助检查" prop="Ancillary_examination">
          <el-input  type="text" v-model="data.Ancillary_examination">
        </el-input>
        </el-form-item>
        <el-form-item label="望诊" prop="Visit">
          <el-input  type="text" v-model="data.Visit">
        </el-input>
        </el-form-item>
        <el-form-item label="闻诊" prop="Sniff">
          <el-input  type="text" v-model="data.Sniff">
        </el-input>
        </el-form-item>
        <el-form-item label="切诊" prop="Incision">
          <el-input  type="text" v-model="data.Incision">
        </el-input>
        </el-form-item>
        <el-form-item label="今日节气" prop="Solar_terms_today">
          <el-input  type="text" v-model="data.Solar_terms_today">
        </el-input>
        </el-form-item>
        <el-form-item label="辩证分析" prop="Dialectical_analysis">
          <el-input  type="text" v-model="data.Dialectical_analysis">
        </el-input>
        </el-form-item>
        <el-form-item label="中医诊断" prop="TCM_diagnosis">
          <el-input  type="text" v-model="data.TCM_diagnosis">
        </el-input>
        </el-form-item>
        <el-form-item label="西医诊断" prop="Western_medical_diagnosis">
          <el-input  type="text" v-model="data.Western_medical_diagnosis">
        </el-input>
        </el-form-item>
        <el-form-item label="治疗建议" prop="Treatment">
          <el-input  type="text" v-model="data.Treatment">
        </el-input>
        </el-form-item>
        <el-form-item label="医嘱" prop="Orders">
          <el-input  type="text" v-model="data.Orders">
        </el-input>
        </el-form-item>
        <el-form-item label="医生签名" prop="signature">
          <el-input  type="text" v-model="data.signature">
        </el-input>
        </el-form-item>
        <el-form-item>
     <el-button type="primary" v-if="data.id" @click="editrecord('data')"
            >保存</el-button
          >
          <el-button v-if="!data.id" type="primary" @click="addrecord('data')"
            >添加</el-button
          >
          <el-button  @click="resetForm('data')">重置</el-button>
          <el-button type="primary" plain @click="fanhui">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  <script>
  import moment from "moment";
  import { mapState } from "vuex";
  export default {
    name: "AddUser",
    data() {
      var checkAge = (rule, value, callback) => {
        setTimeout(() => {
          if (!Number(value)) {
            callback(new Error("请输入数字值"));
          } else {
            if (value < 1 || value > 100) {
              callback(new Error("年龄格式错误"));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      return {
        data: { },
        rules: {
          username: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:2, max:10 , message: "长度在 2到 10个字符", trigger: "blur" },
          ],
          name: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min: 2, max: 3, message: "长度在 2到 3个字符", trigger: "blur" },
          ],
          age: [{ validator: checkAge, trigger: "blur" }],
          //性别
sex: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 2, message: "长度在 1 到 2个字符", trigger: "blur" },
          ],
//病历号
Medical_record_number: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//民族
 national: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
 //婚况
 Marital_status: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
 //职业
 occupation: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//
//工作单位
workplace: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//电话
phone: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//家庭住址
address: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//就诊科室
Visiting_department: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ], 
//就诊日期
Visiting_date: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//主诉
Complaints: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//现病史
History_of_present_illness: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//刻下症
Engraving_the_disease: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//既往史
Anamnesis: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//过敏史
History_of_allergies: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//辅助检查
Ancillary_examination: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//望诊
Visit: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//闻诊
Sniff: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//切诊
Incision: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//今日节气
Solar_terms_today: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//辩证分析
Dialectical_analysis: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//
//中医诊断
TCM_diagnosis: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//西医诊断
Western_medical_diagnosis: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//治疗建议
Treatment: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//医嘱
Orders: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//医生签名
signature: [
            { required: true, message: "请输入内容", trigger: "blur" },
            { min:1, max: 200, message: "长度在 1到 200个字符", trigger: "blur" },
          ],
//
        },
      };
    },
    created() {
  		// console.log(this.$route.query, '郎伟');
          this.data = this.$route.query.record || {}
          this.data.Visiting_date=moment(this.data.Visiting_date).format(
                "YYYY-MM-DD"
              );
    },
    computed: {
    ...mapState("AdminLogin", ["admininfo"]),
  },
    methods: {
      fanhui() {
        this.$router.push('/admin/recordlist')
      },
      addrecord() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            this.$message("已提交");
            // console.log(this.data);
              let sendtime = moment().format("YYYY-MM-DD HH:mm:ss");
            let sender=this.admininfo.adminname
            let {
              username,
              name,
              sex,
              age,
              Medical_record_number,
              national,
              Marital_status,
              occupation,
              workplace,
              phone,
              address,
              Visiting_department, 
              Visiting_date,
              Complaints,
              History_of_present_illness,
              Engraving_the_disease,
              Anamnesis,
              History_of_allergies,
              Ancillary_examination,
              Visit,
              Sniff,
              Incision,
              Solar_terms_today,
              Dialectical_analysis,
              TCM_diagnosis,
              Western_medical_diagnosis,
              Treatment,
              Orders,
              signature
            } = this.data;
            this.$api
              .AddRecord({
                username,
                  sender, sendtime,
                  name,
              sex,
              age,
              Medical_record_number,
              national,
              Marital_status,
              occupation,
              workplace,
              phone,
              address,
              Visiting_department, 
              Visiting_date,
              Complaints,
              History_of_present_illness,
              Engraving_the_disease,
              Anamnesis,
              History_of_allergies,
              Ancillary_examination,
              Visit,
              Sniff,
              Incision,
              Solar_terms_today,
              Dialectical_analysis,
              TCM_diagnosis,
              Western_medical_diagnosis,
              Treatment,
              Orders,
              signature
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$message({
                    message: "恭喜您，添加成功",
                    type: "success",
                  });
                  this.$refs.data.resetFields();
                } else if (res.data.status === 304) {
                } else if (res.data.status === 520) {
                }
              });
          } else {
            this.$message.error("提交失败");
            return false;
          }
        });
      },
      editrecord() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            this.$message("已提交");
            // console.log(this.data);
              let edittime = moment().format("YYYY-MM-DD HH:mm:ss");
              let editer = this.admininfo.adminname
            let id = this.$route.query.record.id
            let {
              username,
              name,
              sex,
              age,
              Medical_record_number,
              national,
              Marital_status,
              occupation,
              workplace,
              phone,
              address,
              Visiting_department, 
              Visiting_date,
              Complaints,
              History_of_present_illness,
              Engraving_the_disease,
              Anamnesis,
              History_of_allergies,
              Ancillary_examination,
              Visit,
              Sniff,
              Incision,
              Solar_terms_today,
              Dialectical_analysis,
              TCM_diagnosis,
              Western_medical_diagnosis,
              Treatment,
              Orders,
              signature
            } = this.data;
            this.$api
              .EditRecord({
                  editer, edittime,
                  name,
              sex,
              age,
              Medical_record_number,
              national,
              Marital_status,
              occupation,
              workplace,
              phone,
              address,
              Visiting_department, 
              Visiting_date,
              Complaints,
              History_of_present_illness,
              Engraving_the_disease,
              Anamnesis,
              History_of_allergies,
              Ancillary_examination,
              Visit,
              Sniff,
              Incision,
              Solar_terms_today,
              Dialectical_analysis,
              TCM_diagnosis,
              Western_medical_diagnosis,
              Treatment,
              Orders,
                  signature,
              id
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$message({
                    message: "恭喜您，修改成功",
                    type: "success",
                  });
                  this.$router.push('/admin/recordlist')
                  this.$refs.data.resetFields();
                } else if (res.data.status === 304) {
                } else if (res.data.status === 520) {
                }
              });
          } else {
            this.$message.error("提交失败");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    
    },
  };
  </script>
  <style lang="less" scoped>
  .main {
    padding-top: 29px;
    padding-left: 15px;
    padding-right: 30px;
    width: 70%;
    min-height: 500px;
    margin: 30px auto;
    background-color: rgba(0, 0, 0, 0.5);
  }
  button:first-child {
    margin-left: 103px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    background-color: white;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  label {
    color: red;
  }
  /deep/ .el-form-item__label {
    color: aqua;
  }
  /deep/ .el-button {
    margin-left: 80px;
  }
  </style>