
const express = require('express');
const app = express();
app.use(express.json());
const Datastore = require('nedb');
const database = new Datastore('books.db')
database.loadDatabase();

const port = process.env.PORT || 3000;
app.listen( port, () => {
    console.log(`listening at ${port}....`)
})
app.use(express.static('public/'));

app.get('/books', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            console.log('Coud not find data')
        }
        data.sortBy(function(o){ return o.date });
        response.json(data);
    })
});
// outsourced function
(function(){
    if (typeof Object.defineProperty === 'function'){
      try{Object.defineProperty(Array.prototype,'sortBy',{value:sb}); }catch(e){}
    }
    if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;
  
    function sb(f){
      for (var i=this.length;i;){
        var o = this[--i];
        this[i] = [].concat(f.call(o,o,i),o);
      }
      this.sort(function(a,b){
        for (var i=0,len=a.length;i<len;++i){
          if (a[i]!=b[i]) return a[i]<b[i]?-1:1;
        }
        return 0;
      });
      for (var i=this.length;i;){
        this[--i]=this[i][this[i].length-1];
      }
      return this;
    }
  })();


app.post('/new_book', async (request, response) => {
    const blob = await request.body;
    updatedb(blob);
})

function updatedb (item) {
    database.insert(item);
}

app.post ('/hat', async (request, response) => {
    const idremove = await request.body;
    const id = idremove.id;

    database.remove({_id: `${id}`}, (err, data ) => {
        if (err) {
            console.log("error while saerching db");
        }
    })
})