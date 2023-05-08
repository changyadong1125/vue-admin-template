import request from '@/utils/request'
const SYSROLE_URI = '/admin/system/sysUser/'

export default {
  getSysUserList(page, limit, sysUser) {
    // 返回的是后端响应的数据
    return request({
      url: `${SYSROLE_URI}/${page}/${limit}`,
      method: 'get',
      // 当前端给后端携带的是普通参数用 params 携带的是JSON对象用 data 看是否有@requestBody
      params: sysUser
    })
  },
  save(sysUser) {
    // 返回的是后端响应的数据
    return request({
      url: `${SYSROLE_URI}/update`,
      method: 'post',
      data: sysUser
    })
  },
  update(id) {
    // 返回的是后端响应的数据
    return request({
      url: `${SYSROLE_URI}/update/${id}`,
      method: 'get'
    })
  },
  edit(sysUser) {
    // 返回的是后端响应的数据
    return request({
      url: `${SYSROLE_URI}/update`,
      method: 'put',
      data: sysUser
    })
  },
  delete(id) {
    // 返回的是后端响应的数据
    return request({
      url: `${SYSROLE_URI}/query/${id}`,
      method: 'delete'
    })
  },
 //更新用户状态
 updateStatus(userId,status){
  return request({
      url:`${api_name}/update/${userId}/${status}`,
      method:"put"
  });
}

}
