interface AMapResponse{
	status:string,
	regeocode:{
		addressComponent:{
			city:string,
			province:string
		}
	}
}
export const reverseCode = (lo:number,la:number):Promise<string> =>{
	return new Promise((resolve,reject)=>{
		uni.request({
			url: "https://restapi.amap.com/v3/geocode/regeo",
			data:{
				key:"bc8cad0d87d1287717e5f1007d8a3309",
				location: `${lo},${la}`
			},
			success(res){
				console.log("高德api接口返回",res)
				const data:AMapResponse = res.data as AMapResponse
				if(data.status!=="1"){
					reject("接口请求失败")
					return
				}
				const address = data.regeocode.addressComponent.city.length?data.regeocode.addressComponent.city:data.regeocode.addressComponent.province
				console.log("地址是:"+ address)
				resolve(address)
			},
			fail(err){
				reject(`请求失败:${err.errMsg}`)
			}
		})
	})
}
