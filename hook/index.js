async function preInit(inputObj) {

}

async function postInit(inputObj) {
    console.log(`\n     _______  _______  _______ 
    |       ||   _   ||       |
    |  _____||  |_|  ||    ___|
    | |_____ |       ||   |___ 
    |_____  ||       ||    ___|
     _____| ||   _   ||   |___ 
    |_______||__| |__||_______|
                                        `)
    console.log(`\n    Welcome to the start-sae application
     This application requires to open these services: 
         SAE : https://sae.console.aliyun.com/
     This application can help you quickly deploy the Zblog project:
         Full yaml configuration: https://github.com/devsapp/sae
     This application homepage: https://github.com/devsapp/start-sae\n`)
}

module.exports = {
    postInit,
    preInit
}