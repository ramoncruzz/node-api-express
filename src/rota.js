const minhaRotaEspecial = (_,res) =>{
    console.log('minha rota especial foi chamada');
    res.send('rota 66');
};

module.exports = minhaRotaEspecial;