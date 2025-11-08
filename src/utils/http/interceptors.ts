import type { RequestConfig } from "./types"
const getToken = ()=>uni.getStorageSync("token") || ""


//请求拦截器:
export const requestInterceptor = (config:RequestConfig)=>{
	const token = getToken()
	if(token){
		 config.header = {
			 ...config.header,
			 Authorization: `Bearer ${token}`
		 }
	}
	return config
}

/**
{
	code: 200,
	nessage: "请求成功",
	success: true,
	data: 数据
}
 */

// 响应拦截器
export const transformResponse = (res:any)=>{
	if(res.statusCode!=200){
		throw new Error("请求失败")
	}
	if(!res.data.success){
		throw new Error("请求失败")
	}
	return res.data.data
}
