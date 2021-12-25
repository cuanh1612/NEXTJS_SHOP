export const imageUpload = async (images: string[]) => {
    let imgArr = []
    for (const item of images) {
        const formData = new FormData()
        formData.append("file", item)
        formData.append("upload_preset", process.env.CLOUD_UPDATE_PRESET as string)
        formData.append("cloud_name", process.env.CLOUD_NAME as string)

        const res = await fetch(process.env.CLOUD_API as RequestInfo, {
            method: "POST",
            body: formData
        })

        const data = await res.json()
        imgArr.push({public_id: data.public_id, url: data.secure_url})
    }
    return imgArr
}