(function (window) {

    window.my = my = {};

    my.actions = {

        load : function (country, code) {
            $.ajax({
                type: 'POST',
                url: '/data',
                data: 'country=' + country + '&code=' + code,
                success: function(data){
                    $('#data').empty();
                    $('#data').append(data);
                }
            });
        },
        appendRow : function (country, code, type) {
            var data = 'country=' + country + '&code=' + code + '&type=' + type,
                value = $('#input-value').val();

            // Value
            if (typeof value === 'undefined' || value === '') {
                alert('value is null');
                return;
            }

            if (type === 'year') {
                var year = $('#input-year').children(':selected').val();
                data += '&value=' + year + ',' + value;
            }
            else if (type === 'quarter') {
                var year = $('#input-year').children(':selected').val();
                var quarter = $('#input-quarter').children(':selected').val();
                data += '&value=' + year + '-Q' + quarter + ',' + value;
            }
            else if (type === 'month') {
                var year = $('#input-year').children(':selected').val();
                var month = $('#input-month').children(':selected').val();
                data += '&value=' + year + '-' + month + ',' + value;
            }
            else if (type === 'week') {
                var year = $('#input-year').children(':selected').val();
                var week = $('#input-week').children(':selected').val();
                data += '&value=' + year + '-W' + week + ',' + value;
            }
            else if (type === 'day') {
                var year = $('#input-year').children(':selected').val();
                var month = $('#input-month').children(':selected').val();
                var day = $('#input-day').children(':selected').val();
                data += '&value=' + year + '-' + month + '-' + day + ',' + value;
            }
            else {
                alert('undefined type: ' + type);
                return
            }

            $.ajax({
                type: 'POST',
                url: '/append_row',
                data: data,
                success: function(data){
                    my.actions.load(country, code);
                }
            });
        },
        appendRows : function (country, code, type) {
            var data = 'country=' + country + '&code=' + code + '&type=' + type,
                value = $('#input-text').val();

            // Value
            if (typeof value === 'undefined' || value === '') {
                alert('value is null');
                return;
            }
            data += '&value=' + value;

            $.ajax({
                type: 'POST',
                url: '/append_row',
                data: data,
                success: function(data){
                    my.actions.load(country, code);
                },
                error: function(data){
                    $('#input-alert-message').text(data.responseText);
                    $('#input-alert').show();
                }
            });
        },
        switchFormAppend : function () {
            if ($('#form-append :visible').length > 0) {
                $('#form-append').hide();
                $('#form-append-multi').show();
            } else {
                $('#form-append-multi').hide();
                $('#form-append').show();
            }
        },
        toggleFormRegisterIndicator : function () {
            if ($('#form-register-indicator :visible').length > 0) {
                $('#form-register-indicator').hide();
                $('#form-register-indicator-open').text('New..');
            } else {
                $('#form-register-indicator').show();
                $('#form-register-indicator-open').text('Hide');
            }
        },
        switchFormRegisterIndicator : function () {
            if ($('#form-register-indicator-solo :visible').length > 0) {
                $('#form-register-indicator-solo').hide();
                $('#form-register-indicator-multi').show();
            } else {
                $('#form-register-indicator-multi').hide();
                $('#form-register-indicator-solo').show();
            }
        },
        registerIndicator : function (update) {
            var country, code, name, type, cat1, cat2, cat3,
                prefix = 'input',
                data = '';

            // check arg
            if (typeof update !== 'undefined' && update !== 'false') {
                update = true;
                prefix = 'edit';
            } else {
                update = false;
            }

            // get values
            country = $('#' + prefix + '-country').children(':selected').val();
            code = $('#' + prefix + '-code').val();
            name = $('#' + prefix + '-name').val();
            type = $('#' + prefix + '-type').children(':selected').val();
            cat1 = $('.cat1:visible', '#' + prefix).children(':selected').val();
            cat2 = $('.cat2:visible', '#' + prefix).children(':selected').val();
            cat3 = $('.cat3:visible', '#' + prefix).children(':selected').val();

            // check values
            if (typeof code === 'undefined' || code === '') {
                alert('Code is empty.');
                return;
            }
            if (typeof name === 'undefined' || name === '') {
                alert('Name is empty.');
                return;
            }
            if (typeof type === 'undefined' || type === '') {
                alert('Type is not specified.');
                return;
            }
            if (typeof cat1 === 'undefined' || cat1 === '') {
                alert('Type is not specified');
                return;
            }
            if (typeof cat2 === 'undefined') {
                cat2 = ''
            }
            if (typeof cat3 === 'undefined') {
                cat3 = ''
            }

            // generate arg data
            data = "data=" + country + ',' + code + ',' + name + ',' + type + ',' + cat1 + ',' + cat2 + ',' + cat3 + '&update=' + update;

            $.ajax({
                type: 'POST',
                url: '/register_indicator',
                data: data,
                success: function(data){
                    location.reload();
                }
            });
        },
        registerIndicators : function (country) {
            var data = $('#input-text').val();

            if (typeof data === 'undefined' || data === '') {
                alert('data is null');
                return;
            }
            data = "data=" + data

            $.ajax({
                type: 'POST',
                url: '/register_indicator',
                data: data,
                success: function(data){
                    location.reload();
                },
                error: function(data){
                    $('#input-alert-message').text(data.responseText);
                    $('#input-alert').show();
                }
            });
        },
        deleteIndicators : function () {
            $('input[type="checkbox"]', '.indicators').filter(':checked').each(function() {
                var country = $(this).data('country');
                var code = $(this).data('code');
                if (confirm("Are you sure to delete " + country + ":" + code + "?") === true) {
                    $.ajax({
                        type: 'POST',
                        url: '/delete_indicator',
                        data: 'country=' + country + '&code=' + code,
                        success: function(data){
                            $('#indicator-' + country + '-' + code).remove();
                        }
                    });
                };
            });
        },
        deleteIndicatorValue : function () {
            $('input[type="checkbox"]', '.indicator-values').filter(':checked').each(function() {
                var country = $(this).data('country');
                var code = $(this).data('code');
                var index = $(this).data('index');

                var date = $('.line-date', '#line-' + country + '-' + code + '-' + index).text();
                var value = $('.line-value', '#line-' + country + '-' + code + '-' + index).text();
                if (confirm("Are you sure to delete '" + date + ":" + value + "' ?") === true) {
                    $.ajax({
                        type: 'POST',
                        url: '/delete_indicator_value',
                        data: 'country=' + country + '&code=' + code + '&index=' + index,
                        success: function(data) {
                            $('#line-' + country + '-' + code + '-' + index).remove();
                        }
                    });
                }
            });
        },
        toggleFormRegisterCategory : function () {
            if ($('#form-register-category :visible').length > 0) {
                $('#form-register-category').hide();
                $('#form-register-category-open').text('New..');
            } else {
                $('#form-register-category').show();
                $('#form-register-category-open').text('Hide');
            }
        },
        registerCategory : function (country) {
            var cat1 = $('.cat1:visible').children(':selected').val();
            if (typeof cat1 === 'undefined' || cat1 === '') {
                var newCat1Code = $('#input-new-cat1-code').val();
                var newCat1Name = $('#input-new-cat1-name').val();
                if (typeof newCat1Code === 'undefined' || newCat1Code === '') {
                    alert("Category code is empty.");
                    return;
                }
                if (typeof newCat1Name === 'undefined' || newCat1Name === '') {
                    alert("Category name is empty.");
                    return;
                }
                $.ajax({
                    type: 'POST',
                    url: '/register_category',
                    data: "code=" + newCat1Code + "&name=" + newCat1Name,
                    success: function(data){
                        location.reload();
                    }
                });
                return;
            }

            var cat2 = $('.cat2:visible').children(':selected').val();
            if (typeof cat2 === 'undefined' || cat2 === '') {
                var newCat2Code = $('#input-new-cat2-code').val();
                var newCat2Name = $('#input-new-cat2-name').val();
                if (typeof newCat2Code === 'undefined' || newCat2Code === '') {
                    alert("Category code is empty.");
                    return;
                }
                if (typeof newCat2Name === 'undefined' || newCat2Name === '') {
                    alert("Category name is empty.");
                    return;
                }
                $.ajax({
                    type: 'POST',
                    url: '/register_category',
                    data: "code=" + newCat2Code + "&name=" + newCat2Name + "&parent_code=" + cat1,
                    success: function(data){
                        location.reload();
                    }
                });
                return;
            }

            var cat3 = $('.cat3:visible').children(':selected').val();
            if (typeof cat3 === 'undefined' || cat3 === '') {
                var newCat3Code = $('#input-new-cat3-code').val();
                var newCat3Name = $('#input-new-cat3-name').val();
                if (typeof newCat3Code === 'undefined' || newCat3Code === '') {
                    alert("Category code is empty.");
                    return;
                }
                if (typeof newCat3Name === 'undefined' || newCat3Name === '') {
                    alert("Category name is empty.");
                    return;
                }
                $.ajax({
                    type: 'POST',
                    url: '/register_category',
                    data: "code=" + newCat3Code + "&name=" + newCat3Name + "&parent_code=" + cat2,
                    success: function(data){
                        location.reload();
                    }
                });
                return;
            }
        },
        deleteCategories : function () {
            $('input[type="checkbox"]', '.categories').filter(':checked').each(function() {
                var code = $(this).data('code');
                if (confirm("Are you sure to delete " + code + "?") === true) {
                    $.ajax({
                        type: 'POST',
                        url: '/delete_category',
                        data: 'code=' + code,
                        success: function(data){
                            $('#category-' + code).remove();
                        }
                    });
                };
            });
        }
    };
})(window);
