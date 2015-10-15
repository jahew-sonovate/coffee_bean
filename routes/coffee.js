
var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    cache = {};

module.exports = function(router){

    router.route('/').get(help);
    router.route('/coffee').get(list);
    router.route('/coffee/:slug').get(find);

    function help(req, res){
        res.sendFile(path.join(__dirname, '..', 'help.html'));
    }

    function list(req, res){

        if(cache.data){
            return res.status(200).json(_result(_map(cache.data)));
        }

        _load(function(err, data){
            if(err){
                return res.status(500).json({error: err});
            }

            return res.status(200).json(_result(_map(data)));
        });
    }

    function find(req, res){

        var coffee = cache.data;

        if(coffee){
            return lookForCoffee();
        }

        _load(function(err, data){
            if(err){
                return res.status(500).json({error: err});
            }

            coffee = data;

            return lookForCoffee();
        });

        function lookForCoffee(){

            var found = _.find(
                coffee,
                function(item){
                    return item.slug === req.params.slug
                }
            );

            if(!found){
                return res.status(404).json({error: 'Not Found'});
            }

            return res.status(200).json(_result(found));
        }
    }

    function _result(d){
        return {result: d};
    }

    function _load(done){
        fs.readFile(path.join('db', 'coffee_list.json'), function(err, data){

            if(err){
                return done(err);
            }

            cache.data = JSON.parse(data);

            return done(null, cache.data);
        });
    }

    function _map(data){
        return _.map(
            data,
            function(item){
                return {
                    name: item.name,
                    slug: item.slug,
                    flavour: item.flavour
                };
            }
        );
    }

};