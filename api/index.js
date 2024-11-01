const express =  require("express")
const cors =  require("cors")
const axios = require('axios');
const cheerio = require("cheerio");
const Repositorio = require('../Repositorio');

function retornaUrlRepositorios (page){
    return `https://github.com/CarlosHLP060304?tab=repositories&page=${page}`;
}

function retornaUrlRepositorio(nomeRepositorio) {
    return `https://github.com/CarlosHLP060304/${nomeRepositorio}`
}

let router = express()

router.use(cors())

router.get("/",async(req,res)=>{
    let repositorios = await getRepositorios(req.query.page)
    res.send(repositorios)
})

router.listen(8080)

async function getRepositorios(page) {
    let repositorios = [];
    let { data } = await axios.get(retornaUrlRepositorios(page));
    const $ = cheerio.load(data);
    
    const repositoriosList = $("#user-repositories-list ul li");
    
    for (const repositorio of repositoriosList) {
        let nomeRepositorio = $(repositorio).find('[itemprop="name codeRepository"]').text().trim();
        let paginaCarregada = await retornaPaginaHTMLRepositorioCarregada(nomeRepositorio)       
        let descricao =  await retornaDescricao(paginaCarregada)
        let linguagensUtilizadas = await retornaLinguagensUtilizadas(paginaCarregada);

        let teste = new Repositorio();
        teste.setNome(nomeRepositorio);
        teste.setDescricao(descricao);
        teste.setLinguagens(linguagensUtilizadas);
        repositorios.push(teste);
    }

    return repositorios;
}

async function retornaPaginaHTMLRepositorioCarregada(nomeRepositorio){
    let {data} = await axios.get(retornaUrlRepositorio(nomeRepositorio))
    const $ = cheerio.load(data)
    return $
}

async function retornaDescricao(paginaCarregada) {
    const $ = await paginaCarregada
    let descricao = []
    $(".Layout-sidebar .BorderGrid-cell").each(
        (index,div) => {     
            const h2 = $(div).find("h2").text().trim();
            if (h2 === "About") {
                descricao = $(div).find("p").text().replace(/\s+/g, ' ')
            }            
        } 
    )
    return descricao
}

async function retornaLinguagensUtilizadas(paginaCarregada) {
    const $ = await paginaCarregada
    let linguagens = []
    $(".Layout-sidebar .BorderGrid-cell").each(
        (index,div) => {     
            const h2 = $(div).find("h2").text().trim();
            if (h2 === "Languages") {
                linguagens = $(div).text().replace(/\s+/g, ' ')
                .split("Languages")[1].split(" ").filter(str => str !== "" && !str.includes("%"))
            }
        } 
    )
    return linguagens 
}