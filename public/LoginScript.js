const config = {
    headers: {
        'content-type':'application/json'
    }
}
function callLoginApi() {
    const student = {
          loginId:document.getElementById("loginId").value,
          password:document.getElementById("password").value
    }

    axios.post('/auth/login', JSON.stringify(student),config).then(({ data }) =>
    {
        if (data.status === 200)
            window.alert(data.message+"  "+data.data.name);
        else{
            window.alert(data.error);
        }
            console.log(data);
        }).catch(err => {
            window.alert(err.error);
            console.log("Something went wrong please try again" + err);
        })

}

