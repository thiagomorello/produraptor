import cheerio from 'cheerio';
import request from 'request';
import axios from 'axios';

export default {
  async store(req, res){

    const url = req.body.url;
    console.log(url);

    if(url){
      const html = await downloadPage(url);
      var $ = cheerio.load(html);
      var mlprices = $('.ui-search-result__wrapper .andes-card a .ui-search-result__content-wrapper .ui-search-item__group.ui-search-item__group--price .ui-search-price.ui-search-price--size-medium.ui-search-item__group__element .ui-search-price__second-line .price-tag').text().split('R$');
      var ship = $('.ui-search-result__wrapper .andes-card a .ui-search-result__content-wrapper .ui-search-item__group.ui-search-item__group--shipping').html();

      if(ship){
        var isFull = true;
      }
      else{
        var isFull = false;
      }

      var totalPrices = 0;
      var minorPrice = 999999999;
      var size = mlprices.length - 1;

      mlprices.map( function(price){

        price = price.replace(',','.')*1;
        if(minorPrice > price &&  price > 0){
          minorPrice = price;
        }
        totalPrices = totalPrices + price;
      });
      totalPrices = Math.ceil(totalPrices/size);

    }

    res.json({ media: totalPrices, minorPrice: minorPrice, isFull:isFull});



    /*var n = $(".pagination").find(".next").prev('a').text()*1;

    await axios.get('http://precifacil.com/updateControl.php?init=true&sto_id='+req.query.sto_id);

    if(n>0){
      const products  = [];
      for(var i=1; i<=n; i++){
        var page = await downloadPage('https://www.comprasparaguai.com.br/busca/?page='+i+'&loja='+loja);
        var $ = cheerio.load(page);
        $(".promocao-produtos-item-text").each(async function(){
            var data = {};
            data.store = req.query.sto_id;
            data.cod =   $(this).find(".promocao-item-info").find("div").find("strong").text().trim()*1;
            data.title = $(this).find(".promocao-item-info").find(".promocao-item-nome").find("a.truncate").text().trim();
            data.price = $(this).find(".preco-dolar").text().trim().replace("U$","").replace(".", "").replace(",",".").trim()*1;
            const re = await axios.post('http://precifacil.com/updateStores.php', data);
        });
        console.log('Loja '+loja+' Página '+i+' de '+n);
      }
      await axios.get('http://precifacil.com/updateControl2.php?sto_id='+req.query.sto_id);
      return res.json({'success' : true});
    }
    else{

      res.json({ error : 'Loja não encontrada'} );
    }

    */
  }
}



function downloadPage(url) {
  return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
          if (error) reject(error);
          if (response.statusCode != 200) {
            return false;
          }
          else{
           resolve(body);
          }

      });
  });
}
