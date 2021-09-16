import React, {useEffect, useState, useRef} from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';


function Imageclassify(){
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([]);
  const [generateResult, setGenerateResult] = useState();

  const imageRef = useRef();
  const textInputRef = useRef();
  const fileInputRef = useRef();

  const loadModel = async ()=> {
    setIsModelLoading(true)
    try {
      setIsModelLoading(false)
    } catch (error) {
      setIsModelLoading(false)
    }
  }

  useEffect(()=> {
   loadModel()
 }, [model]);

  if(isModelLoading) {
    return <h2>Model Loading ....</h2>
  }
  const uploadImage= (e)=> {
    const {files} = e.target
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setImageURL(url)
      setResults([])
    } else {
      setImageURL(null)
    }
  }
  const identify = async ()=> {
    textInputRef.current.value = ""
    setGenerateResult("Generating the Results.....")
    const model = await mobilenet.load()
    setModel(model)
    const results = await model.classify(imageRef.current)
    setResults(results)
    if (results.length > 0){
      setGenerateResult("")
    }
  }
  const handlerChange = (e) =>{
    setImageURL(e.target.value)
    setResults([])
  }
  const triggerupload = ()=> {
    fileInputRef.current.click()
  }
  return(
    <>
      <header className="d-flex justify-content-center align-items-center">
        <h1 className="title">Image Classification With Mobilenet </h1>
      </header>
      <section className="classification-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
               <div className="input-form d-flex justify-content-center align-items-center">
                 <input className="fileInput" type="file" accept="image/*" capture="camera" ref={fileInputRef} onChange={uploadImage}/>
                 <button className="uploadimage" onClick={triggerupload}>Upload Image</button>
                 <span className="or">Or</span>
                 <input className="input-url" type="text" placeholder="Paste ImageURL" ref={textInputRef} onChange={handlerChange}/>
               </div>
               <div className="image-cont d-flex justify-content-center align-items-center">
                 {imageURL && <img src={imageURL} crossOrigin = "Anonymous" alt="uploadImage"  ref={imageRef} />}
               </div>
               <div className="d-flex justify-content-center align-items-center">
               {imageURL && <button className="mybtn" onClick={identify}>Classify Image</button>}
               </div>
            </div>
            <div className="col-lg-6">
              <div className="result-title">
               <div className="d-flex justify-content-center align-items-center">
                <h1>Result</h1>
               </div>
                <div className="d-flex justify-content-center align-items-center">
                 <div className="showloading">{generateResult}</div>
                 {results.length > 0 && <div className="result-text">
                     {results.map((result, index) => {  //start
                       return(
                         <div className="result-box" key={result.className}>
                           <span className="name">{result.className}</span>
                           <span className="confidence">&nbsp;&nbsp;Confidence: {(result.probability * 100).toFixed(2)}% </span>
                        </div>
                       )
                     })}
                 </div>}
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </>
  )
}
export default Imageclassify;
