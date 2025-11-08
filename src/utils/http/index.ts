import { RequestConfig } from "./types";
import { requestInterceptor,transformResponse } from "./interceptors";

function request(config:RequestConfig){
	const processedConfig = requestInterceptor(config)
	const url = `https://www.liuliuzhua.cn${processedConfig.url}`
	return new Promise((resolve,reject)=>{
		uni.request({
			 url,
			 method: processedConfig.method || "GET",
			 data: processedConfig.data,
			 header: processedConfig.header,
			 success(res){
				 try{
					resolve(transformResponse(res))
				 }catch(error){
					 reject(error)
				 }
			 },
			 fail(err){
				 reject('请求失败')
			 }
		})
	})
}
export function get(url:string,data?:any){
	return request({url,method:"GET",data})
}

export const post = (url:string,data?:any)=>request({url,method:"POST",data})