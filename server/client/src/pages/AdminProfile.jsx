import React, { useState } from 'react'

const AdminProfile = () => {
  
  const [formdata, setFormdata] = useState({
    firstname:'',
    lastname:"",
    birthday:'',
    state:'',
    city:'',
    zip:'',
    designation:'',
    mysebsite:'',
    gender:''
  })

  const submitHandler=(data)=>{
    console.log('submit button clicked',data);
  }

  const  handleChange =(name,value)=>{
    setFormdata({...formdata,[name]:value})

    console.log(formdata);
  }

  return (
    <div className="admin-container" style={{ padding: '0px' }}>
      <div className="admin-cover-photo">
        <label htmlFor="file-input">
          <img className="admin-profile" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" />
        </label>
        <input id='file-input' type='file' style={{display:'none'}} accept="image/png, image/jpeg" />
      </div>

      <div className="admin-profile-name">Jame Smith</div>

      {/* form-group */}
      <div style={{ marginLeft: '50px' }}>
        <form>

          <div className='form-row'>
            <div className="form-group col-3">
              <label>First Name</label>
              {/* <Input type='text' name='first_name' className='form-control' placeholder={'First Name'}/> */}
              <input className="form-control" type="text" placeholder="First Name" name="firstname" onBlur={(e)=>handleChange(e.target.name,e.target.value)} />
            </div>
            <div className="form-group col-3">
              <label >Last Name</label>
              {/* <Input type='text' className='form-control' placeholder={'First Name'}/> */}
              <input className="form-control" type="text" placeholder="Last Name" name='lastname' onBlur={(e)=>handleChange(e.target.name,e.target.value)} />
            </div>
          </div>

          <div className='form-row'>
            <div className="form-group col-3">
              <label> Designation </label>
              <select className="custom-select" name='designation' onBlur={(e)=>handleChange(e.target.name,e.target.value)}>
                <option value="co-founder">Co-founder</option>
                <option value="executive">Executive</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div className="form-group col-3">
              <label> My Website </label>
              {/* <Input type='text' className='form-control'  placeholder={'Jamesmith.com'}/> */}
              <input className="form-control" type="text" placeholder="Jamesmith.com" name='mysebsite' onBlur={(e)=>handleChange(e.target.name,e.target.value)} />
            </div>
          </div>

          <div className='form-row'>
            <div className="form-group col-3">
              <label> Gender </label>
                <div className="input-group-prepend" id="button-addon3">
                  <button className="btn btn-outline-secondary" type="button" style={{marginTop:'0px', marginBottom:'0px',marginRight:'10px'}} onClick={()=>handleChange('gender','male')} > Male </button>
                  <button className="btn btn-outline-secondary" type="button" style={{marginTop:'0px', marginBottom:'0px'}} onClick={()=>handleChange('gender','Female')}> Female </button>
                </div>
            </div>
            <div className="form-group col-3">
              <label> Birthday </label>
              <input className="form-control" type="date" placeholder="MM/DD/YYYY" name='birthday' onBlur={(e)=>handleChange(e.target.name,e.target.value)} />
            </div>
          </div>

          <div className='form-row'>
            <div className="form-group col-3">
              <label> City </label>
              {/* <Input type='text' className='form-control ' placeholder={'City'}/> */}
              <input className="form-control" type="text" placeholder="City" name='city' onBlur={(e)=>handleChange(e.target.name,e.target.value)} />
            </div>
            <div className="form-group col-2">
              <label> State </label>
              <select className="custom-select" name='state' onBlur={(e)=>handleChange(e.target.name,e.target.value)}>
                <option value="Delhi"> Delhi </option>
                <option value="Agra"> Agra </option>
                <option value="Bihar"> Bihar </option>
              </select>
            </div>
            <div className="form-group col-1">
              <label> ZIP </label>
              <input className="form-control" type="text" placeholder="201310" name='zip' onBlur={(e)=>handleChange(e.target.name,e.target.value)}/>
            </div>
          </div>

          <button className="btn btn-primary" type="button" onClick={submitHandler} > Submit </button>
          <button className="btn btn-outline-primary" type="reset" style={{ marginLeft: '15px' }}> Reset All </button>

        </form>
      </div>
    </div>
  )
}

export default AdminProfile