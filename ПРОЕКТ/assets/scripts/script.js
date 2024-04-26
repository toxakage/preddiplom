$(document).ready(function(){

    $('#regform').on('submit', function() {
        var email = $(this).find('input[name="username"]').val();
        var password = $(this).find('input[name="password"]').val();
        var paswordagain = $(this).find('input[name="password2"]').val();
        $.ajax({
            url: '/assets/php/do_register.php',
            method: 'post',
            dataType: 'html',
            data: {'username': email,'password': password,'password2': paswordagain},
            success: function(data){
            if(data=='0') {
                Swal.fire({
                    title: "Ошибка",
                    text: "Пароли не совпадают!",
                    icon: "error"
                    });
            } else if(data=='1') {
                Swal.fire({
                    title: "Ошибка",
                    text: "Аккаунт с таким адрессом электронной почты уже зарегистрирован!",
                    icon: "error"
                    });
            } else {
                Swal.fire({
                    title: "Успешно",
                    text: "Вы успешно зарегистрировались!",
                    icon: "success"
                    });
            }
            }
        });
        return false;
    });
    $('#authform').on('submit', function() {
        var email = $(this).find('input[name="username"]').val();
        var password = $(this).find('input[name="password"]').val();
        $.ajax({
            url: '/assets/php/do_login.php',
            method: 'post',
            dataType: 'html',
            data: {'username': email,'password': password},
            success: function(data){
            if(data=='0') {
                Swal.fire({
                    title: "Ошибка",
                    text: "Аккаунт с таким адрессом электронной почты не зарегистрирован!",
                    icon: "error"
                    });
            } else if(data=='1') {
                Swal.fire({
                    title: "Успешно",
                    text: "Вы успешно авторизовались!",
                    icon: "success"
                }).then((result) => {
                    if(result.isConfirmed) {
                        location.reload();
                    }
                });
            } else {
                Swal.fire({
                    title: "Ошибка",
                    text: "Неверный пароль!",
                    icon: "error"
                    });
            }
            }
        });
        return false;
    });
    var productModal = document.getElementById('productModal')
    productModal.addEventListener('show.bs.modal', function (event) {
        var modalTitle = productModal.querySelector('.modal-title')
        var modalBodyImg = productModal.querySelector('.post__photo img')
        var modalBodyDesc = productModal.querySelector('.post__text')
        var modalBodySum = productModal.querySelector('.post__sum span')

        var button = event.relatedTarget
        var login = button.getAttribute('data-bs-login')
        var id = button.getAttribute('data-bs-id')
        var title = button.getAttribute('data-bs-title')
        var desc = button.getAttribute('data-bs-desc')
        var price = button.getAttribute('data-bs-price')

        modalTitle.textContent = title
        modalBodyImg.setAttribute('src','assets/img/product_' + id + '.png')
        modalBodyDesc.textContent = 'Описание: ' + desc
        modalBodySum.textContent = 'Цена за 1шт: ' + price + 'руб'

        var addorder = productModal.querySelector('#addorder')
        addorder.addEventListener("click",function() {
            $.ajax({
                url: './assets/php/add_order.php',
                method: 'post',
                dataType: 'html',
                data: {'login': login,'product': id,'price': price},
                success: function(data){
                    if(data=='BAD') {
                        Swal.fire({
                            title: "Ошибка",
                            text: "Данный товар уже есть в корзине!",
                            icon: "error"
                        });
                    } else if(data=='GOOD') {
                        Swal.fire({
                            title: "Успешно",
                            text: "Товар успешно добавлен в корзину!",
                            icon: "success"
                        }).then((result) => {
                            if(result.isConfirmed) {
                                location.reload();
                            }
                        });
                    }
                }
            });
        })
        
    })

    var moscow_map;

    ymaps.ready(function(){
        moscow_map = new ymaps.Map("first_map", {
            center: [53.675119, 23.844692],
            zoom: 14
        });
        myGeoObject = new ymaps.GeoObject({
            geometry: {
                type: "Point",
                coordinates: [53.675119, 23.844692]
            }
        });
        moscow_map.geoObjects.add(myGeoObject);
        moscow_map.controls.remove('geolocationControl'); // удаляем геолокацию
        moscow_map.controls.remove('searchControl'); // удаляем поиск
        moscow_map.controls.remove('trafficControl'); // удаляем контроль трафика
        moscow_map.controls.remove('typeSelector'); // удаляем тип
        moscow_map.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
        moscow_map.controls.remove('zoomControl'); // удаляем контрол зуммирования
        moscow_map.controls.remove('rulerControl'); // удаляем контрол правил
        moscow_map.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)
    });
    $('#BalanceForm').on('submit', function() {
        var sum = $(this).find('input[name="sum"]').val();
        var balanceButton = document.querySelector('#balanceSumbit');
        var login = balanceButton.getAttribute('data-bs-login');
        if(sum!='Сумма') {
            $.ajax({
                url: '/assets/php/update_balance.php',
                method: 'post',
                dataType: 'html',
                data: {'sum': sum,'login': login},
                success: function(){
                    Swal.fire({
                        title: "Успешно",
                        text: "Вы пополнили баланс на " + sum  + " руб.",
                        icon: "success"
                        }).then((result) => {
                            if(result.isConfirmed) {
                                location.reload();
                            }
                        });
                }
            });   
        } else {
            Swal.fire({
                title: "Ошибка",
                text: 'Похоже, что вы не заполнили все поля. Введите сумму пополнения.',
                icon: "error"
                });
        }
        return false;
    });

    var files;

    $('#image').on('change', function(){
        files = this.files;
    });

    $('#AddProductForm').on('submit', function() {
        var title = $(this).find('input[name="title"]').val()
        var desc = $(this).find('input[name="desc"]').val()
        var price = $(this).find('input[name="price"]').val()

        if(title!='Название' && desc!='Описание' && price!='Цена') {
            if(typeof files != 'undefined') {

                $.ajax({
                    url: '/assets/php/add_product.php',
                    method: 'post',
                    dataType: 'html',
                    data: {'title': title,'desc': desc,'price': price},
                    success: function( data ){
                        
                        if(parseInt(data)>=0) {
                            var id = parseInt(data);

                            var data = new FormData();

                            $.each( files, function( key, value ){
                                data.append( key, value );
                            });
            
                            data.append( 'my_file_upload', 1 );
                            data.append( 'id',id);
            
                            // AJAX запрос
                            $.ajax({
                                url         : '/assets/php/uploader.php',
                                type        : 'POST', // важно!
                                data        : data,
                                cache       : false,
                                dataType    : 'html',
                                processData : false,
                                contentType : false,
                                success     : function( respond ){
                                    Swal.fire({
                                        title: "Успешно",
                                        text: "Вы добавили новый товар в каталог.",
                                        icon: "success"
                                        }).then((result) => {
                                            if(result.isConfirmed) {
                                                location.reload();
                                            }
                                        });
                                }
            
                            });
                        } else {
                            Swal.fire({
                                title: "Ошибка",
                                text: 'Ошибка загрузки изображения на сервер. Попробуйте еще раз.',
                                icon: "error"
                                });
                        }
                    }
                });

            } else {
                Swal.fire({
                    title: "Ошибка",
                    text: 'Похоже, что вы не выбрали изображение товара.',
                    icon: "error"
                    });
            }
        } else {
            Swal.fire({
                title: "Ошибка",
                text: 'Похоже, что вы не заполнили все поля. Введите название, описание и цену товара.',
                icon: "error"
                });
        }
        return false;
    });
    $('#OrdersForm').on('submit', function() {
        var adres = $(this).find('input[name="adres"]').val();
        var phone = $(this).find('input[name="number"]').val();
        var orderButton = document.querySelector('#ordersSumbit');
        var login = orderButton.getAttribute('data-bs-login');
        var price = orderButton.getAttribute('data-bs-money');
        var balance = orderButton.getAttribute('data-bs-balance');
        var ids = orderButton.getAttribute('data-bs-orders')
        if(adres!='Адрес' && phone!='Номер телефона') {
            if(parseInt(balance)>=parseInt(price)) {
                $.ajax({
                    url: '/assets/php/move_orders.php',
                    method: 'post',
                    dataType: 'html',
                    data: {'adres': adres,'phone': phone,'login': login,'money': price,'ids': ids},
                    success: function(){
                        Swal.fire({
                            title: "Успешно",
                            text: "Вы оплатили товары из корзины. С баланса списано: " + price + " руб.",
                            icon: "success"
                            }).then((result) => {
                                if(result.isConfirmed) {
                                    location.reload();
                                }
                            });
                    }
                });   
            } else {
                Swal.fire({
                    title: "Ошибка",
                    text: 'Похоже, что на вашем балансе не хватает денег. Пополните баланс, чтобы продолжить. Чтобы пополнить баланс нажмите "Профиль" -> "Пополить баланс"',
                    icon: "error"
                    });
            }
        } else {
            Swal.fire({
                title: "Ошибка",
                text: 'Похоже, что вы не заполнили все поля. Введите ваш адрес и номер телефона.',
                icon: "error"
                });
        }
        return false;
    });
    $('#logoutForm').click(function() {
        $.ajax({
            url: '/assets/php/do_logout.php',
            method: 'post',
            dataType: 'html',
            success: function(){
                Swal.fire({
                    title: "Успешно",
                    text: "Вы вышли из аккаунта!",
                    icon: "success"
                }).then((result) => {
                    if(result.isConfirmed) {
                        location.reload();
                    }
                });
            }
        });
        return false;
    });

    var orderModal = document.getElementById('ordersModal')
    var orderModalBody = orderModal.querySelector(".modal-body")
    var deleteOrders = orderModalBody.querySelectorAll(".btn-close")
    deleteOrders.forEach((deleteOrder) => {
        deleteOrder.addEventListener("click",function(){

            var orderid = deleteOrder.getAttribute('data-bs-id')

            $.ajax({
                url: '/assets/php/delete_order.php',
                method: 'post',
                dataType: 'html',
                data: {'orderid': orderid,'admin': 'none'},
                success: function(){
                    Swal.fire({
                        title: "Успешно",
                        text: "Вы удалили товар из корзины!",
                        icon: "success"
                    }).then((result) => {
                        if(result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
            });
        })
    });
    var productAdminModal = document.getElementById('adminModal')
    var productAdminBody = productAdminModal.querySelector(".modal-body")
    var deleteProducts = productAdminBody.querySelectorAll(".btn-close")
    deleteProducts.forEach((deleteProduct) => {
        deleteProduct.addEventListener("click",function(){

            var id = deleteProduct.getAttribute('data-bs-id')

            $.ajax({
                url: '/assets/php/delete_product.php',
                method: 'post',
                dataType: 'html',
                data: {'id': id},
                success: function(){
                    Swal.fire({
                        title: "Успешно",
                        text: "Вы удалили товар из каталога!",
                        icon: "success"
                    }).then((result) => {
                        if(result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
            });
        })
    });
    var orderModerationModal = document.getElementById('orderModerationModal')
    var orderModerationBody = orderModerationModal.querySelector(".modal-body")
    var dissmissOrders = orderModerationBody.querySelectorAll(".btn-secondary")
    var acceptOrders = orderModerationBody.querySelectorAll(".btn-primary")
    acceptOrders.forEach((acceptOrder) => {
        acceptOrder.addEventListener("click",function(){

            var id = acceptOrder.getAttribute('data-bs-id')
            var login = acceptOrder.getAttribute('data-bs-login')

            $.ajax({
                url: '/assets/php/accept_orders.php',
                method: 'post',
                dataType: 'html',
                data: {'id': id,'login': login},
                success: function(){
                    Swal.fire({
                        title: "Успешно",
                        text: "Вы одобрили заказ.",
                        icon: "success"
                    }).then((result) => {
                        if(result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
            });
        })
    });
    dissmissOrders.forEach((dissmissOrder) => {
        dissmissOrder.addEventListener("click",function(){

            var id = dissmissOrder.getAttribute('data-bs-id')
            var price = dissmissOrder.getAttribute('data-bs-price')
            var login = dissmissOrder.getAttribute('data-bs-login')

            $.ajax({
                url: '/assets/php/delete_order.php',
                method: 'post',
                dataType: 'html',
                data: {'orderid': id,'price': price,'login': login,'admin': 'true'},
                success: function(){
                    Swal.fire({
                        title: "Успешно",
                        text: "Вы отклонили заказ. Клиенту вернулись деньги на баланс.",
                        icon: "success"
                    }).then((result) => {
                        if(result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
            });
        })
    });
});