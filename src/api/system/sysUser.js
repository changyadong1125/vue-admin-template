import request from '@/utils/request'

const api_name = "/admin/system/sysUser"

export default {
    //分页及带条件查询的方法
    findPageList(current , size , queryVo){
        return request({
            url:`${api_name}/${current}/${size}`,
            method:"get",
            params:queryVo
        });
    },

    //删除的方法
    delete(id){
        return request({
            url:`${api_name}/query/${id}`,
            method:"delete"
        });
    },

    //添加的方法
    save(sysUser){
        return request({
            url:`${api_name}/update`,
            method:"post",
            data:sysUser
        });
    },

    //根据id查询
    getById(id){
        return request({
            url:`${api_name}/update/${id}`,
            method:"get"
        });
    },

    //更新
    update(sysUser){
        return request({
            url:`${api_name}/update`,
            method:"put",
            data: sysUser
        });
    },

    //更新用户状态
    updateStatus(userId,status){
        return request({
            url:`${api_name}/update/${userId}/${status}`,
            method:"put"
        });
    }
}