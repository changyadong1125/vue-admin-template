import request from '@/utils/request'
const SYSROLE_URI = '/admin/system/sysRole/'

export default {
  getSysRoleList(page, limit, sysRoleVo) {
    // 返回的是后端响应的数据
    return request({
      url: `${SYSROLE_URI}/${page}/${limit}`,
      method: 'post',
      // 当前端给后端携带的是普通参数用 params 携带的是JSON对象用 data 看是否有@requestBody
      data: sysRoleVo
    })
  },
  removeById(id) {
    return request({
      url: `${SYSROLE_URI}/query/${id}`,
      method: 'delete'
    })
  },
  batchRemove(ids) {
    return request({
      url: `${SYSROLE_URI}/query`,
      method: 'delete',
      data: ids
    })
  },
  save(sysROleVo) {
    return request({
      url: `${SYSROLE_URI}/update`,
      method: 'post',
      data: sysROleVo
    })
  },
  edit(id) {
    return request({
      url: `${SYSROLE_URI}/update/${id}`,
      method: 'put'
    })
  },
  update(sysRoleVo) {
    return request({
      url: `${SYSROLE_URI}/update`,
      method: 'put',
      data: sysRoleVo
    })
  },
  
  getRolesByUserId(id) {
    return request({
      url: `${SYSROLE_URI}/query/${id}`,
      method: 'get',
    })
  },
  
  assignRoles(assignRolesVo) {
    return request({
      url: `${SYSROLE_URI}/doAssign`,
      method: 'post',
      data:assignRolesVo
    })
  },
}
