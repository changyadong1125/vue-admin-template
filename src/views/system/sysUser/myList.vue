<template>
  <div class="app-container">
   

<div class="search-div">
  <el-form label-width="70px" size="small">
    <el-row>
      <el-col :span="8">
        <el-form-item label="关 键 字">
          <el-input style="width: 95%" v-model="sysUserVo.keyword" placeholder="用户名/姓名/手机号码"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="createTimes"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="margin-right: 10px;width: 100%;"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="display:flex">
      <el-button type="primary" icon="el-icon-search" size="mini"  @click="onSubmit(1)">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
    </el-row>
  </el-form>
</div>










    <!-- dialog -->
    <div class="search-div">
      <el-button
        type="success"
        icon="el-icon-plus"
        size="mini"
        @click="show"
      >添 加</el-button>
      <el-dialog title="A/R" :visible.sync="dialogFormVisible">
        <el-form ref="sysUser" :model="sysUser" :rules="rules">

          <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
            <el-input v-model="sysUser.username" autocomplete="off" />
          </el-form-item>

          <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
            <el-input v-model="sysUser.password" autocomplete="off" />
          </el-form-item>

          <el-form-item prop="name" label="姓名" :label-width="formLabelWidth">
            <el-input v-model="sysUser.name" autocomplete="off" />
          </el-form-item>

          <el-form-item prop="phone" label="手机" :label-width="formLabelWidth">
            <el-input v-model="sysUser.phone" autocomplete="off" />
          </el-form-item>
          

          <el-form-item prop="deptId" label="部门id" :label-width="formLabelWidth">
            <el-input v-model="sysUser.deptId" autocomplete="off" />
          </el-form-item>

          <el-form-item prop="postId" label="部门id" :label-width="formLabelWidth">
            <el-input v-model="sysUser.postId" autocomplete="off" />
          </el-form-item>

          <el-form-item prop="description" label="描述" :label-width="formLabelWidth">
            <el-input v-model="sysUser.description" autocomplete="off" />
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addAndUpdate()"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="id" label="编号" width="88" />
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="password" label="密码" width="480" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="phone" label="手机" width="180" />
      <el-table-column label="状态" width="80">
        <!-- <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status === 1"
            @change="switchStatus(scope.row)">
          </el-switch>
        </template> -->
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="deptId" label="部门id" width="180" />
      <el-table-column prop="postId" label="岗位id" width="180" />
      <el-table-column prop="description" label="描述" width="180" />
     
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
          size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="update(scope.row.id)"
            title="修改"
          ></el-button>
          <el-button
          size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="remove(scope.row.id)"
            title="删除"
          ></el-button>
          <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignRole(scope.row)" title="分配角色"/>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      style="text-align: center"
      :current-page="pageNum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import sysUser from '@/api/system/sysUser.js'
export default {
  data() {
    return {
      list: [],
      createTimes: [],
      pageNum: 3,
      pageSize: 4,
      total: 0,
      sysUser: {},
      sysUserVo: {},
      dialogFormVisible: false,
      formLabelWidth: '120px',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getSysUserList()
  },
  methods: {
     //切换用户状态
     switchStatus(row) {
      //切换status的值
      row.status = row.status == 1 ? 0 : 1;
      //调用api中更新状态的方法
      api.updateStatus(row.id,row.status).then(res=>{
         //弹出提示框
         this.$message.success(res.message);
         //重新查询
         this.getSysUserList(this.page);
      });
    },
    onSubmit(pageNum = 1){
      if(this.createTimes && this.createTimes.length == 2){
        this.sysUserVo.createTimeBegin = this.createTimes[0];
        this.sysUserVo.createTimeEnd = this.createTimes[1];
      }
      this.pageNum = pageNum
      sysUser
        .getSysUserList(pageNum, this.pageSize, this.sysUserVo)
        .then((resp) => {
          this.list = resp.data.records
          this.total = resp.data.total
        })
    }
    
    ,
    resetData() {
      //将搜索条件清空
      this.sysUser = {};
      //清空日期
      this.createTimes = [];
      //重新查询
      this.getSysUserList();
    },

  
    remove(id) {
      sysUser.delete(id).then(resp => {
        this.$message.success(resp.message)

        if (this.list.length === 1) {
          this.getSysUserList(this.pageNum - 1)
        } else {
          this.getSysUserList(this.pageNum)
        }
      })
    },
    update(id) {
      sysUser.update(id).then(resp => {
        this.sysUser = resp.data
        this.dialogFormVisible = true
      })
    },
    addAndUpdate() {
      this.$refs['sysUser'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          if (!this.sysUser.id) {
            sysUser.save(this.sysUser).then(resp => {
              this.$message.success(resp.message)
              this.sysUser = {}

            
                this.getSysUserList(Math.ceil((parseInt(this.total + 1)) / parseInt(this.pageSize)))
           
            
              
            })
          } else {
            sysUser.edit(this.sysUser).then(resp => {
              this.$message.success(resp.message)
              this.getSysUserList(this.pageNum)
            })
          }
        } else {
          this.$message.error('添加失败')
          return false
        }
      })
    },
    show() {
      this.dialogFormVisible = true
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getSysUserList(this.pageNum, this.pageSize, this.sysUser)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getSysUserList(this.pageNum, this.pageSize, this.sysUser)
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    getSysUserList(pageNum = 1) {
      this.pageNum = pageNum
      sysUser
        .getSysUserList(pageNum, this.pageSize, this.sysUser)
        .then((resp) => {
          this.list = resp.data.records
          this.total = resp.data.total
        })
    },
      //去分配角色的页面
      showAssignRole (row) {
      //将当前行的数据赋值给sysUser
      this.sysUser = row;
      //弹出分配角色的表单
      this.dialogRoleVisible = true;
      //调用roleApi中的方法查询当所有角色及当前用户已分配的角色id
      roleApi.getRolesByUserId(row.id).then(res=>{
        //给所有角色赋值
        this.allRoles = res.data.allRoles;
        //给当前用户已经拥有的角色id赋值
        this.userRoleIds = res.data.userRoleIds;
        //全选复选框的状态
        this.checkAll = (this.userRoleIds.length == this.allRoles.length);
        //设置是否是不确定的值
        this.isIndeterminate = (this.userRoleIds.length > 0 && this.userRoleIds.length < this.allRoles.length)
        
      });
    },

    /*
    全选勾选状态发生改变的监听
    */
    handleCheckAllChange (value) {// value 当前勾选状态true/false
      // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
      this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
      // 如果当前不是全选也不全不选时, 指定为false
      this.isIndeterminate = false
    },

    /*
    角色列表选中项发生改变的监听
    */
    handleCheckedChange (value) {
      const {userRoleIds, allRoles} = this
      this.checkAll = userRoleIds.length === allRoles.length && allRoles.length>0
      this.isIndeterminate = userRoleIds.length>0 && userRoleIds.length<allRoles.length
    },

    //分配角色
    assignRole () {
      //隐藏分配角色的表单
      this.dialogRoleVisible = false;
      //设置一个变量用来提交数据
      var assignRoleVo = {
        userId:this.sysUser.id,
        roleIdList:this.userRoleIds
      }
      //调用roleApi中分配角色的方法
      roleApi.assignRoles(assignRoleVo).then(res=>{
        this.$message.success(res.message);
        this.fetchData(this.page);
      });
    },
  }
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
