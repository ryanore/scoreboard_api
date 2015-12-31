var ObjectId = require('mongodb').ObjectID;

var BaseController = function(mod, n){
  this.model = mod;
  console.log('BASECONTROLLER! ::: '+n);
};


BaseController.prototype = {

  /**
   *  POST - create a new Record
   *  
   */
  create: function(req, res) {
    var data = req.body || {};
    var user = new this.model(data);
    user.save(function(err) {
      if( err ) return res.status(400).json(err);
      res.json(user);
    });
  },
    
  /**
   *  GET - list records
   *  @param {Object} req.query Should describe query parameters for filtering
   */
  list: function(req, res) {
    this.model.find(req.query).sort({
      'createdAt': -1
    })
    .exec(function(err, records) {
      if (err){
        return res.status(400).json(err);
      }
      res.json(records);
    });  
  },

  /**
   *  GET - find one Record
   *  @param {id} req.prams.id The ID of the record is required in url
   */
  getOne: function(req, res) {
    this.model.findOne({
      _id: req.params.id
    }, {
    	password: 0
    })
    .exec(function(err, records){
      if(err){
        res.status(400).json(err);
      } 

      res.json(records);
    });
  },
  
  /**
   *  PUT - update one record
   *  @param {Object} req.params.id The ID of the record to update is required in url
   *  Mongoose won't allow non-schema items to be saved, and handles validation
   */
  update: function(req, res) {
    var data = req.body || {};
    var id = req.params.id;
    this.model.findById(id, function (err, doc) {
      if (doc) {
        for(var attr in data){
          if( data.hasOwnProperty(attr)){
            doc[attr] = data[attr];
          }
        }
        doc.save(function (err) {
          if(err) res.status(400).json(err);
          var d = doc.toJSON();
          delete d.password;
          res.json(d);
        });
      }
    });  
  },


  /**
   *  DELETE - 
   *  Delete one record by _id
   *  
   */
  delete: function(req, res, next){
    this.model.findOne({_id: req.params.id  }, function(err, doc) {
      if(err){
         res.status(400).json(err);
      } 
      doc.remove(function(){
        res.json(doc);
      });
    }); 
  },



  /**
   * DELETE - Delete Multipe Records
   * Requires converting array of strings into ObjectIds
   */
  deleteSome: function(req, res, next){
    var objarray = [];
    var ids = JSON.parse(req.body.ids);
    var toDel = ids || [];
    
    for(var i=0; i<toDel.length; i++){
    	objarray[i] = ObjectId(toDel[i]);
		}

    this.model.remove( { _id: {$in: objarray}}, function(err,del){
      if(err){
        res.status(400).json(err);
      }else{
        res.json(del);
      }
    });
  }

};


module.exports = BaseController;
