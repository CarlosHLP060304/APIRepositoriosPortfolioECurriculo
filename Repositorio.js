class Repositorio{

    constructor(){
        this.nome = null
        this.linguagemUtilizadas = null
        this.descricao = null
    }
    setNome(nome){
        this.nome = nome
    }
    setLinguagens(linguagensUtilizadas){
        this.linguagemUtilizadas = linguagensUtilizadas
    }
    setDescricao(descricao){
        this.descricao = descricao
    }
}

module.exports = Repositorio