import React, {useEffect, useState} from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import "./App.css"

function App (props) {
  const [imageUrl,setImageUrl] = useState([])
  const [imageId,setImageId] = useState(parseInt(0))

  const [ipAddress,setIpAddress] = useState("")
  const [locationInfo,setLocationInfo] = useState([])




  function handleTakePhoto (dataUri) {
    // Do stuff with the photo...
    console.log('takePhoto');
  }

  const getVisitorIp = async () => {
    try{
      const response = await fetch("https://api.ipify.org");
      const data = await response.text()
      console.log(data)
      setIpAddress(data);
    }catch(error){
      console.log("Error find at", error)
    }
  }

  const getLocationInfo = async () => {
    try{
      const response = await fetch(`http://ip-api.com/json${ipAddress}`);
      const data = await response.json()
      console.log(data)
      setLocationInfo(data);
    }catch(error){
      console.log("Error find at", error)
    }
  }

  const handleTakePhotoAnimationDone = async (dataUri) => {
    // Do stuff with the photo...
    await getVisitorIp();
    await getLocationInfo();

    const eachImage = {
      imageLink:dataUri,
      id:imageId,
      ip: locationInfo.ip,
      status: locationInfo.status,
      country: locationInfo.country,
      countryCode: locationInfo.countryCode,
      region: locationInfo.region,
      regionName: locationInfo.regionName,
      city: locationInfo.city,
      zip: locationInfo.zip,
      lat: locationInfo.lat,
      lon: locationInfo.lon,
      timezone: locationInfo.timezone,
      isp: locationInfo.isp,
      org: locationInfo.org
    }
    setImageId(imageId+1)
    setImageUrl([...imageUrl,eachImage])
    console.log(eachImage)
    console.log('takePhoto');
  }

  function handleCameraError (error) {
    console.log('handleCameraError', error);
  }

  function handleCameraStart (stream) {
    console.log('handleCameraStart');
  }

  function handleCameraStop () {
    console.log('handleCameraStop');
  }

  console.log(imageUrl)

  const MainImageList = imageUrl.slice(1,imageUrl.length)

  return (
    <div className='image-container'>
      <div className='camera-container'>
        <Camera
          onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
          onTakePhotoAnimationDone = { (dataUri) => { handleTakePhotoAnimationDone(dataUri); } }
          onCameraError = { (error) => { handleCameraError(error); } }
          idealFacingMode = {FACING_MODES.ENVIRONMENT}
          // idealResolution = {{width: 400, height: 100}}
          imageType = {IMAGE_TYPES.JPG}
          imageCompression = {0.97}
          isMaxResolution = {true}
          isImageMirror = {false}
          isSilentMode = {false}
          isDisplayStartCameraError = {true}
          isFullscreen = {false}
          sizeFactor = {1}
          onCameraStart = { (stream) => { handleCameraStart(stream); } }
          onCameraStop = { () => { handleCameraStop(); } }
        />
      </div>
      <ul className='ul-list'>
        {MainImageList.map(eachOne => (
          <li key={eachOne.id} className='image-item'>
            <div>
              <h5>Image {eachOne.id}</h5>
              <img src={eachOne.imageLink} alt='kalyan' className='selfie-image'/>
            </div>
            <div className='location-container'>
              <h5>Location Info</h5>
              <p className='image-details-para'>Country : {eachOne.country}</p>
              <p className='image-details-para'>State : {eachOne.regionName}</p>
              <p className='image-details-para'>Zip Code : {eachOne.zip}</p>
              <p className='image-details-para'>Time Zone : {eachOne.timezone}</p>
              <p className='image-details-para'>Internet Provider : {eachOne.isp}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;