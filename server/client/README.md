/* ------------------------- login CSS --------------------- */
.register-photo {
    background: white;
    padding: 100px;
}
.ttn-logo{
    position: absolute;
    left: 440px;
    /* padding-right: 100px; */
    height: 40px;
}
.text-center{
    padding-top: 20px;
    text-align: center;
}
h6{
    color: grey;
    text-align: center;
}
.register-photo .form-container {
    display: table;
    max-width: 900px;
    width: 90%;
    margin: 0 auto;
}
.register-photo form {
    display: table-cell;
    width: 400px;
    background-color: #ffffff;
    padding: 40px 60px;
    color: #505e6c
}
.register-photo form h2 {
    font-size: 24px;
    line-height: 1.5;
    margin-bottom: 30px
}
.register-photo form .form-control {
    background: transparent;
    border: none;
    border-bottom: 1px solid #dfe7f1;
    border-radius: 0;
    box-shadow: none;
    outline: none;
    color: inherit;
    text-indent: 0px;
    height: 40px
}
.register-photo form .form-check {
    font-size: 13px;
    line-height: 20px;
    padding-top: 20px;
    padding-right: 30px;
}
#forgot-pass{
    padding-left: 30px;
}
.register-photo form .btn-primary {
    background: rgb(218, 55, 204);
    border: none;
    border-radius: 25px;
    padding: 15px 32px 11px;
    box-shadow: none;
    margin-top: 35px;
    outline: none;
    color: white;
}

#google-btn{
    color: rgb(224, 81, 105);
    background: white;
    border: 2px solid black;
    border-color: rgb(224, 81, 105);
    outline: black;
    margin-left: 77px;
    border-radius: 25px;
    margin-top: 45px;
    /* border: red; */
}
  /* .register-photo form .btn-primary:hover,
  .register-photo form .btn-primary:active {
  background: green
  } */
.register-photo form .btn-primary:active {
    transform: translateY(1px)
}
.register-photo form .already {
    display: block;
    text-align: center;
    font-size: 12px;
    color: #6f7a85;
    opacity: 0.9;
    text-decoration: none
}
.sign_in {
    padding-top: 40px;
    color: #8C55AA;
    font-family: 'Ubuntu', sans-serif;
    font-weight: bold;
    font-size: 23px;
}



/* ------------------------- Admin CSS -------------------------------- */
/* body{
    font-family: Montserrat, sans-serif;
    background: rgb(223, 223, 223);
} */
.admin-container{
    user-select: none;
    margin: 50px auto;
    background: white;
    color: #b3b8cd;
    border-radius: 5px;
    width: 70%;
    height: 100%;
    /* text-align: center; */
    box-shadow: 0 10px 20px -10px rgba(0,0,0,.75);
    margin-left: 80px;
}
.admin-cover-photo{
    background: url(https://images.unsplash.com/photo-1540228232483-1b64a7024923?ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80);
    height: 160px;
    width: 100%;
    border-radius: 5px 5px 0 0;
    float: left;
}
.admin-profile{
    height: 120px;
    width: 120px;
    border-radius: 5%;
    /* margin: 93px 0 0 -175px; */
    margin: 93px 1200px 0 50px;
    /* border: 1px solid #1f1a32; */
    padding: 2px;
    background: #292343;
}
#file-input{
  visibility: hidden;
}
.admin-profile-name{
    line-height: 180px;
    font-size: 25px;
    font-weight: bold;
    /* margin: 27px 0 0 120px; */
    margin: 0px 0px 0px 50px;
    color: black;
}
.about{
    /* position: absolute;
    align-content: flex-start; */
    /* margin right by default 990 */
    margin-top: -100px;
    margin-right: 500px;
    margin-left: 50px;
    color: gray;
    /* line-height: 21px;  */
}
.admin-container button{
    margin: 10px 0 40px 0px;
}
.btns{
    background: rgb(47, 47, 255);
    border: 1px solid #03bfbc;
    padding: 10px 25px;
    color: white;
    border-radius: 3px;
    font-family: Montserrat, sans-serif;
    cursor: pointer;
    /* margin-left: -1080px; */
  }
#add-frnd{
      color: white;
      background-color: rgb(42, 42, 203);
      margin-left: 50px;
}
.btns{
    margin-left: 10px;
    background: transparent;
    color: #02899c;
}
.btns:hover{
    transition: .5s;
}
.admin-container i{
    padding-left: 20px;
    font-size: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: .5s;
}
.admin-container i:hover{
    color: #03bfbc;
} 



/* ----------------------------- UserProfile CSS -------------------------- */
/* body{
    font-family: Montserrat, sans-serif;
    background: rgb(223, 223, 223);
  } */
.user-container{
    user-select: none;
    margin: 50px auto;
    background: white;
    color: #b3b8cd;
    border-radius: 5px;
    width: 70%;
    height: 100%;
    /* text-align: center; */
    box-shadow: 0 10px 20px -10px rgba(0,0,0,.75);
    margin-left: 80px;
    padding: 0px;
}
.user-cover-photo{
    background: url(https://images.unsplash.com/photo-1540228232483-1b64a7024923?ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80);
    height: 160px;
    width: 100%;
    border-radius: 5px 5px 0 0;
    float: left;
}
.user-profile{
    height: 120px;
    width: 120px;
    border-radius: 5%;
    /* margin: 93px 0 0 -175px; */
    margin: 93px 1200px 0 50px;
    /* border: 1px solid #1f1a32; */
    /* padding: 12px;
    background: #292343; */    
}
.user-profile-name{
    line-height: 180px;
    font-size: 25px;
    font-weight: bold;
    /* margin: 27px 0 0 120px; */
    margin: 0px 0px 0px 50px;
    color: black;
}
.user-about{
    /* position: absolute;
    align-content: flex-start; */
    /* margin right by default 990 */
    margin-top: -100px;
    margin-right: 500px;
    margin-left: 50px;
    color: gray;
    /* line-height: 21px;  */
}
.user-container button{
    margin: 10px 0 40px 0px;
}
.user-btns{
    background: rgb(47, 47, 255);
    border: 1px solid #03bfbc;
    padding: 10px 25px;
    color: white;
    border-radius: 3px;
    font-family: Montserrat, sans-serif;
    cursor: pointer;
    /* margin-left: -1080px; */
}
#add-frnd{
    color: white;
    background-color: rgb(42, 42, 203);
    margin-left: 50px;
}
.user-btns{
    margin-left: 10px;
    background: transparent;
    color: #02899c;
}
.user-btns:hover{
    transition: .5s;
}
.user-container i{
    padding-left: 20px;
    font-size: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: .5s;
}
.user-container i:hover{
    color: #03bfbc;
} 