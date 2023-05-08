<template>
  <!-- class值固定为app-container -->
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div" style="margin: 10px">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input
                v-model="sysRoleVo.roleName"
                style="width: 100%"
                placeholder="角色名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="getSysRoleList(1)"
          >搜索</el-button>
          <el-button
            icon="el-icon-refresh"
            size="mini"
            @click="onReset()"
          >重置</el-button>
        </el-row>
      </el-form>
    </div>

    <!-- 工具条 -->
    <div class="tools-div" style="margin: 10px">
      <el-button
        type="success"
        icon="el-icon-plus"
        size="mini"
        @click="add"
      >添 加</el-button>
      <el-button
        class="btn-add"
        size="mini"
        @click="deleteAll()"
      >批量删除</el-button>
    </div>

    <!-- 添加或修改的表单 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form
        ref="sysRoleVo"
        :model="sysRoleVo"
        :rules="rules"
        label-width="150px"
        size="small"
        style="padding-right: 40px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="sysRoleVo.roleName" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="sysRoleVo.roleCode" />
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input v-model="sysRoleVo.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          icon="el-icon-refresh-right"
          @click="dialogVisible = false"
        >取 消</el-button>
        <el-button
          type="primary"
          icon="el-icon-check"
          size="small"
          @click="saveOrUpdate()"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 表格 -->
    <el-table
      ref="table"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      row-key="id"
      :data="list"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
    >
      <el-table-column reserve-selection type="selection" width="55" />

      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称" width="180" />

      <el-table-column prop="roleCode" label="角色编码" width="180" />

      <el-table-column prop="description" label="描述信息" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="修改"
            @click="edit(scope.row.id)"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            title="删除"
            @click="removeDataById(scope.row.id)"
          />
          <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignAuth(scope.row)" title="分配权限"/>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="padding: 20px; text-align: center"
      :current-page="pageNum"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @current-change="getSysRoleList"
    />
  </div>
</template>

<script>
import sysRole from '@/api/system/sysRole.js'
export default {
  data() {
    return {
      pageSize: 5,
      pageNum: 1,
      list: [],
      total: 0,
      sysRoleVo: {},
      loading: true,
      multipleSelection: [],
      form: {},
      dialogVisible: false,
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getSysRoleList()
  },
  methods: {
    showAssignAuth(row) {
  this.$router.push('/system/assignAuth?id='+row.id+'&roleName='+row.roleName);
},
    edit(id) {
      sysRole.edit(id).then((resp) => {
        this.sysRoleVo = resp.data
        this.dialogVisible = true
      })
    },
    saveOrUpdate() {
      this.$refs['sysRoleVo'].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          if (!this.sysRoleVo.id) {
            sysRole.save(this.sysRoleVo).then((resp) => {
              this.$message.success(resp.message)
              this.sysRoleVo = {}
              // this.getSysRoleList();
                this.getSysRoleList(Math.ceil((parseInt(this.total + 1)) / parseInt(this.pageSize)))
            })
          } else {
            sysRole.update(this.sysRoleVo).then((resp) => {
              this.$message.success(resp.message)
              this.sysRoleVo = {}
              this.getSysRoleList(this.pageNum)
            })
          }
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    add() {
      this.dialogVisible = true
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    deleteAll() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var ids = []
          for (var i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id)
          }
          if (ids.length === 0) {
            this.$message.error('请选择要删除的记录!')
            return
          }
          // this.multipleSelection.forEach(item=>ids.push( item.id))
          // 回调地狱-->
          return sysRole.batchRemove(ids)
        })
        .then(() => {
          this.getSysRoleList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$refs.table.clearSelection()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    removeDataById(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 回调地狱-->
          return sysRole.removeById(id)
        })
        .then(() => {
          if (this.list.length === 1) {
            this.getSysRoleList(this.pageNum - 1)
          } else {
            this.getSysRoleList(this.pageNum)
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },

    onReset() {
      this.sysRoleVo = {}
      this.getSysRoleList(1)
    },

    getSysRoleList(pageNum = 1) {
      this.pageNum = pageNum
      // resp就是后端返回的结果 因为已经调用request
      return sysRole
        .getSysRoleList(pageNum, this.pageSize, this.sysRoleVo)
        .then((resp) => {
          // 后端返回的
          this.list = resp.data.records
          this.total = resp.data.total
          this.loading = false
        })
    }
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
