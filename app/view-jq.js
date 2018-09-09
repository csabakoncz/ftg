var main = function () {
    var dbLocation = 'db/'; //relative
    //absolute:
    dbLocation = 'https://csabakoncz.github.io/ftg-data/db/';

    var exId = location.search.replace('?', '')

    downloadDirectly(exId, success);
    downloadThroughExref(exId, success);

    function success(object) {
        exercise = object
        document.title = object.get('title')

        var style = $('<style type="text/css"></style>')

        //does not work, the style needs first to be fetched
        var exStyle = object.get('style').get('content')
        style.html(exStyle)
        $('head').append(style)

        var puzzleDiv = $('<div id="text" style="display: none;"></div>')
        puzzleDiv.html(object.get('content'))
        $('body').append(puzzleDiv)

        var template = _.template(object.get('template').get('content'))
        var templateResultDOM = $(template(object))
        $('body').append(templateResultDOM)

        //make buttons more appealing:
        $('button').button()

        createPuzzle()

        $('#loadingIndicator').hide()
    }

    function createPuzzle() {
        var choiceReg = /#([^#]*)#/g
        var exText = $('#text').html()
        var choices = exText.match(choiceReg).map(function (choice) {
            //strip the hashmarks:
            var res = /^#([^#]*)#$/.exec(choice)
            // console.log(choice,res)
            return res[1];
        })

        choices.forEach(function (m) {
            var choiceE = $('<span class="choice choiceWord correctWord">' + m + '</span>')
            $('#choicesPanel').append(choiceE)
        });

        $('#choicesPanel').droppable({
            accept: '.guess',
            drop: function (event, ui) {
                ui.draggable.data('originalGuess').css({ visibility: '', top: '0px', left: '0px' })
                ui.draggable.data('owner').addClass('pad5')
                ui.draggable.remove()
            }
        })

        $('.choice').draggable({
            revert: 'invalid',
            cursor: 'crosshair'
        })

        var puzzleText = exText.replace(choiceReg, '<span class="gapPanel pad5"></span>')
        $('#puzzleArea').html(puzzleText)
        $('.gapPanel').droppable({
            classes: {
                "ui-droppable-hover": "gap-hover"
            },
            drop: function (event, ui) {
                $(this).removeClass('pad5')

                var originalGuess = ui.draggable.data('originalGuess')
                var dropped = originalGuess || ui.draggable

                $(this).find('.guess').remove()
                var guess = $('<span class="correctWord guess"></span>')
                guess.html(dropped.html())
                guess.data('originalGuess', dropped)
                guess.data('owner', $(this))
                $(this).append(guess)
                guess.draggable({
                    revert: 'invalid',
                    cursor: 'crosshair'
                })

                var oldGuess = $(this).data('guess')
                if (oldGuess) {
                    oldGuess.css({ visibility: '', top: '0px', left: '0px' })
                }
                $(this).data('guess', dropped)
                dropped.css({ visibility: 'hidden' })
                if (originalGuess) {
                    //restore the dashes on the owner:
                    ui.draggable.data('owner').addClass('pad5')
                    //this is something that has already been dropped, delete it
                    ui.draggable.remove()
                }
            }
        })

        $('#checkButton').on('click', function () {
            var dialog = $('<div></div>')
            
            dialog.html(
                $('#correctMsg').html()
                +'<br>'+
                template('#errorsMsg')({_0:5})
                +'<br>'+
                template('#errorsAndUnfilledMsg')({_0:5, _1:6})
            )
            
            var dialogOpts = {
                title: $('#dialogTitle').html(),
                modal: true,
                buttons: {
                }
            };

            dialogOpts.buttons[$('#dialogOK').html()] = function () {
                $(this).dialog("destroy");
            };

            dialog.dialog(dialogOpts);
        })
    }

    function template(selector){
        var text=$(selector).html().replace(/{(.+?)\}/g, '<%= _$1 %>')
        return _.template(text)
    }

    $('#title').append($('<h1>Exercises</h1>')[0])

    function downloadThroughExref(linkId, success) {
        getEntity('link', linkId).then(function (link) {
            var exId = link._ref.split('/')[1];
            downloadDirectly(exId, success);
        });
    }

    function getEntity(type, id) {
        return getDB(type + '/' + id);
    }

    function withExtension(id) {
        if (id.split('.').length > 1) {
            return id;
        }
        else {
            // return id+'.json';
            return id + '.yaml';
        }
    }

    function getDB(ref) {
        var uri = dbLocation + withExtension(ref)

        return $.get(uri).then(function (dbValue) {
            if (isYaml(uri) && typeof dbValue == 'string') {
                return jsyaml.load(dbValue)
            }
            else {
                return dbValue
            }
        });
    }

    function isYaml(uri) {
        return /\.yaml$/.test(uri)
    }

    function getExcercise(id) {
        return getEntity('exercise', id);
    }

    var ParseObject = {
        get: function (what) {
            return this[what];
        }
    }

    function createParseObject(src) {
        var po = Object.create(ParseObject);
        _.extend(po, src);
        return po;
    }

    function downloadDirectly(exId, successCb) {
        getExcercise(exId)
            .then(function (data) {
                return $.when(data, getDB(data.template._ref), getDB(data.style._ref))
            })
            .then(function (exercise, template, style) {
                exercise = createParseObject(exercise);
                template = createParseObject(template);
                style = createParseObject(style);

                exercise.template = template;
                exercise.style = style;

                success(exercise)
            });
    }
}
$(main)