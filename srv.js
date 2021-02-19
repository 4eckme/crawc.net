// Базовые настройки
// -------------------------------------------------------------------------- 
let sid = [];
var base_path = '/home/zxc0/crawc.net/';
var global_lang = "ru";


var db_settings = {
    host     : 'localhost',
    user     : 'root',
    password : '**********',
    database : 'chat_eng',
    multipleStatements: true
}

var cookie_settings = {
    secure: false,
    maxAge: 1000 * 3600 * 24 * 30,
    expires: new Date(Date.now() + 1000 * 3600 * 24 * 30),
    httpOnly: false,
    path: '/',
    domain: 'crawc.net'
}

// Подключаем библиотеки
// -------------------------------------------------------------------------- 
var express = require("express");
//var ipfilter = require('express-ipfilter').IpFilter;

var svgCaptcha = require('svg-captcha');
svgCaptcha.options.width = 84;
svgCaptcha.options.height = 50;

var dateFormat = require('dateformat');
var fs = require('fs');
var md5 = require('md5');
var rand = require('random-int');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);
//var mongoose = require('mongoose');
//var relationship = require("mongoose-relationship");
//mongoose.connect('mongodb://chat-store:mongodb0.crawc.net:12345/chat?replicaSet=myRepl&ssl=true', {useMongoClient: true})
//mongoose.Promise = global.Promise;
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});




var sessionMiddleware = session({
  secret: '**********',
  resave: true,
  saveUninitialized: true,
  cookie: cookie_settings,
  ///tore: new MongoStore({
  //  mongooseConnection: mongoose.connection,
  //  ttl: 3600 * 24,
  //  autoRemove: 'native'
  //})
});

var multer = require('multer');
var im = require('imagemagick');
var sizeOf = require('image-size');
var process = require('process');
var sanitizeHtml = require('sanitize-html');
//var watermark = require('image-watermark');
var gm = require('gm').subClass({imageMagick: true});

var app = express();
//app.use(ipfilter(['109.252.65.193', '109.252.67.193', '37.214.3.100', '171.33.248.144']))
app.use(express.static(__dirname + '/public'));
app.use(cookieParser('uVNm-pH*85&s#-!B'));
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});

var http = require("https")
var soptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/crawc.net/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/crawc.net/fullchain.pem'),
};
var server = http.createServer(soptions, app);
//var Server = http.Server;
//var server = Server(app);
var io = require("socket.io").listen(server);
server.listen(443, 'crawc.net');


io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});


var child_process = require('child_process');
child_process.exec('node /home/zxc0/crawc.net/smilesproxy.js');
 
// Пользовательские функции
// -------------------------------------------------------------------------- 
dateFormat.i18n = {
    dayNames: [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ],
    monthNames: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
};

function escapeHtml(obj) {
  
  for (k in obj) {
      if (typeof obj[k] == 'string')
        obj[k] = obj[k].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") .replace(/"/g, "&quot;") .replace(/'/g, "&#039;");
  }
  
  return obj;
}
function escapeHtmlMin(obj) {
  
  for (k in obj) {
      if (typeof obj[k] == 'string')
        obj[k] = obj[k].replace(/"/g, "&quot;") .replace(/'/g, "&#039;");
  }
  
  return obj;
}


function isset(v) {
    return typeof(v) !== 'undefined';
}

function md5_salt(str) {
    return md5(md5(str)+md5('?2=CZYj9^=M%t?_B'));
}

function hash() {
    var hash = '';
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var chars_count = chars.length;
    for(var i = 0; i < 32; i++) hash += chars.charAt(rand(chars_count-1));
    return hash;
}

function prepare_broadcast(message) {
    
    message = sanitizeHtml(message, {
        allowedTags: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
            'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
            'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'span', 'img', 'iframe'
        ],
        allowedAttributes: {
            'a': ['href', 'target', 'style'],
            'img': ['src', 'style'],
            'iframe':['width', 'height', 'src', 'frameborder', 'allow', 'allowfullscreen'],
            '*': ['style']
        }

    });
    console.log('prepare_broadcast', message);
    return message;
}


String.prototype.replaceArray = function(obj) {
    var replaceString = this;
    var regex;
    for (var i in obj) {
        regex = new RegExp(i, "gi");
        replaceString = replaceString.replace(regex, obj[i]);
    }
    return replaceString;
}

function prepare(message, user_id, n, broadcast) {
    if(!broadcast) message = sanitizeHtml(message, {allowedTags: []});
    var nbr = isset(n) ? n : '<br>';
    if (typeof(n) == 'undefined') n = '<br>';
    if (broadcast == true) {
        var replacements = {
            '\n': n,
            '\\(:smile:\\)': '<span class="smile"></span>',
            '\\(:wink:\\)': '<span class="smile"></span>',
            '\\(:devil:\\)': '<span class="smile"></span>',
            '\\(:coffe:\\)': '<span class="smile"></span>',
            '\\(:happy:\\)': '<span class="smile"></span>',
            '\\(:closed-eyes:\\)': '<span class="smile"></span>',
            '\\(:surprise:\\)': '<span class="smile"></span>',
            '\\(:cool:\\)': '<span class="smile"></span>',
            '\\(:angry:\\)': '<span class="smile"></span>',
            '\\(:shoot:\\)': '<span class="smile"></span>',
            '\\(:sad:\\)': '<span class="smile"></span>',
            '\\(:tongue:\\)': '<span class="smile"></span>',
            '\\(:unclear:\\)': '<span class="smile"></span>',
            '\\(:saint:\\)': '<span class="smile"></span>',
            '\\(:nyasha:\\)': '<span class="smile"></span>',
            '\\(:sleep:\\)': '<span class="smile"></span>',
            '\\(:super:\\)': '<span class="smile"></span>',
            '\\(:beer:\\)': '<span class="smile"></span>',
            '\\(:cry:\\)': '<span class="smile"></span>'
        }
    } else { var replacements = {
         '&gt;&gt;([^\n]+)':'<span class="quote">$1</span><br>',
        '\n': n,
        '`([^`]+)`(\\[(1[0-4])\\])?(\\[((bold)|(normal))\\])?': '<span class="ascii" style="font-size:$3px;font-weight:$5;">$1</span>',
        '\\(:smile:\\)': '<span class="smile"></span>',
        '\\(:wink:\\)': '<span class="smile"></span>',
        '\\(:devil:\\)': '<span class="smile"></span>',
        '\\(:coffe:\\)': '<span class="smile"></span>',
        '\\(:happy:\\)': '<span class="smile"></span>',
        '\\(:closed-eyes:\\)': '<span class="smile"></span>',
        '\\(:surprise:\\)': '<span class="smile"></span>',
        '\\(:cool:\\)': '<span class="smile"></span>',
        '\\(:angry:\\)': '<span class="smile"></span>',
        '\\(:shoot:\\)': '<span class="smile"></span>',
        '\\(:sad:\\)': '<span class="smile"></span>',
        '\\(:tongue:\\)': '<span class="smile"></span>',
        '\\(:unclear:\\)': '<span class="smile"></span>',
        '\\(:saint:\\)': '<span class="smile"></span>',
        '\\(:nyasha:\\)': '<span class="smile"></span>',
        '\\(:sleep:\\)': '<span class="smile"></span>',
        '\\(:super:\\)': '<span class="smile"></span>',
        '\\(:beer:\\)': '<span class="smile"></span>',
        '\\(:cry:\\)': '<span class="smile"></span>',
        '%%([^%]+)%%':'<span class="spoiler">$1</span>',
        '#([0-9a-zA-Z]+)\\[([^\\]]+)\\]':'<span style="color:#$1;">$2</span>',
        '@([1-2][0-9])\\[([^\\]]+)\\]': '<span style="font-size:$1px;">$2</span>',
        '\\$\\$([^\\$]+)\\$\\$':'<span class="run">$1</span>',
        '^(data:audio\/wav;base64,.+)$':'<audio controls src="$1"></audio>',
        '\\[img\\]([a-z0-9.]+)\\[\/img\\]': '<a href="/img/user'+user_id+'/photos/full/$1" class="img"><img src="/img/user'+user_id+'/photos/min/$1"></a>',
        'https:\/\/www\\.youtube\\.com\/watch[?]v=(\\S+)': '&youtube#$1;',
        'https:\/\/youtu\\.be\/(\\S+)': '&youtube#$1;',
		'https:\/\/coub\\.com\/view\/(\\S+)': '&coub#$1;',
        '((https?):\/\/(\\S+((\\.jpg)|(\\.png)|(\\.gif))(\\[?][^\s]+)*))': '&img#$2#$3;',
        'https:\/\/crawc.net\/([a-z]+)\/(\\S+)':'<a href="/$1/$2">$2</a>',
        '(http:\/\/\\S+)': '<a href="$1" target="__blank">$1</a>',
        '(https:\/\/\\S+)': '<a href="$1" target="__blank">$1</a>',
        '&youtube#(\\S+);': '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>' ,
		'&coub#(\\S+);': '<iframe height="315" style="background:#000" src="//coub.com/embed/$1?muted=false&autostart=false&originalSize=false&startWithHD=false" allowfullscreen frameborder="0" allow="autoplay"></iframe>' ,
        '&img#(https?)#([^#\\s]+);': '<div class="bind"><a href="$1://$2" class="img"><img class="bind" src="$1://$2"></a></div>'
    }}
    return message.replaceArray(replacements);
}


app.use (function (req, res, next) {
        if (req.secure) {
                // request was via https, so do no special handling
                next();
        } else {
                // request was via http, so redirect to https
                res.redirect('https://' + req.headers.host + req.url);
        }
});

            

app.use(function (req, res, next) {
    res.html = function(view, lang) {
        fs.readFile(__dirname + '/views/'+view+'.html', 'utf8', function(err, contents) {
            
            if (lang == "ru")
                res.end(contents.replaceArray({
                    '%%en%%':'ru',
                    '%%Read only%%':'Демо-режим',
                    '%%Enter the chat%%':'Вход в чат',
                    '%%Your name%%': 'Ваше имя',
                    '%%Your password%%': 'Ваш пароль',
                    '%%Register%%': 'Быстрая регистрация',
                    '%%Login%%': 'Войти',
                    '%%Register a new user%%': 'Регистрация нового пользователя',
                    '%%Enter your name%%': 'Выберите свое имя',
                    '%%Change your sex%%': 'Выберите свой пол',
                    '%%Male%%': 'Мужской',
                    '%%Female%%': 'Женский',
                    '%%You can add form%%': 'Вы можете дополнить анкету',
                    '%%Your birth date%%': 'Ваш день рождения',
                    '%%Your city%%': 'Ваш город',
                    '%%About you%%': 'Немного о себе',
                    '%%You can leave this field blank%%': 'Можно оставить это поле пустым',
                    '%%Your password 2%%': 'Ваш пароль (не менее 6 символов)',
                    '%%At least 6 characters%%': 'Не менее 6 символов',
                    '%%Repeat password%%': 'Повторите пароль',
                    '%%Cancel%%': 'Отмена',
                    '%%Next%%': 'Далее',
                    '%%You can skip this step%%': 'Этот шаг можно пропустить',
                    '%%Enter E-mail%%': 'Введите E-mail',
                    '%%It is not required, with e-mail you can restore access if you lose your password%%': 'Это не обязательно, но по почте вы сможете восстановить пароль в случае его утери',
                    '%%Back%%': 'Назад',
                    '%%Send%%': 'Готово',
                    '%%190%%': '90',
                    '%%About chat%%': "Про чат",
                    '%%{content}%%': '<h2>Про чат</h2><p><b>Интернет-чат crawc</b> - это платформа для <i>онлайн-общения</i>, <i>творчества</i> и обмена <i>медиа-контентом</i>. <br><br><b>Регистрация</b> и авторизация в два клика, без привязки по почте или мобильному телефону.<br><br>Если вы не проводите все время в <b>социальных сетях</b>, стремитесь к <i>свободному общению</i>, или просто соскучились по атмосфере старых ламповых <b>интернет-форумов</b>, <b>веб-чатов</b> и <b>дневничков</b>, короче говоря если вы хотите понастальгировать по развивающимуся интернету 2010-ых годов, то <u>добро пожаловать</u>! Здесь вы можете <i>создавать свои аккаунты</i> для <i>общения</i>, добавлять <b>фотографии или картинки</b> в свои <i>альбомы</i>, <i>создавать и оформлять</i> собственные <b>чат-комнаты</b> со своим <i>контентом</i>, и, как бонус, - делиться своим <i>артом</i> (вы можете создавать его прямо на сайте).<br><br>Кстати, если вы не можете зайти на <b>Beon</b>, то попробуйте освоиться тут. Этот чат его чем-то напоминает, хотя и не совсем похохож на него.<br><br>Сайт работает на стадии Бета-версии, которая стартовала в середине апреля, тем не менее тут уже больше 300 зарегистрированных <i>юзеров</i> а также небольшое колличество <i>постоянных участников</i>. Суточная посещаемость около <u>100 человек</u> (в основном мимокрокодилов, остальные - <b>анонимные анонимы с анонимных имиджборд</b>).</p><a onclick="$(\'.aboutchat\').addClass(\'hidden\');$(\'#auth\').removeClass(\'hidden\');$(\'.rowmain\').removeClass(\'description\');" class="aboutok">Понятно</a>',
                    '%%title%%': "Онлайн веб чат",
                    '%%description%%': 'Интернет чат новой волны. Бесплатная медийная платформа для общения, творчества и обмена контентом.',
                    '%%keywords%%':'онлайн, веб, чат, чят, чатик, форум, дневники, общение, без регистрации, знакомства, бесплатно',
                    '%%Pixel-art%%':'Рисовач',
                    '%%crawcat%%':'кравкот'
                }));
            else
                res.end(contents.replaceArray({
                    '%%title%%': "Online web chat crawc.net - Beta",
                    '%%description%%': 'New wave internet chat. Media platform for talks and share content.',
                    '%%keywords%%':' online, web, chat, forum, talks, no register, datings, free',
                    '%%{content}%%':'<h2> About chat </h2> <p> <b>Crawc internet chat </b> is a platform for <i> online communication </i> and sharing <i> media content </i>. <br> <br> If you do not spend all your time on <b> social networks </b>, strive for <i> free communication </i>, or just miss the atmosphere of the old tube <b> Internet forums </b>, <b> web chats </b> and <b> diaries </b>, in short on the developing Internet of the 2010s, then <u> welcome </u>! Here you can <i> create your accounts </i> for <i> communication </i>, add <b>photos or pictures </b> to your <i> albums </i> , <i> create and design </i> your own <b> chat rooms </b> with your <i> content </i> and as a bonus, post <i> ascii-art </i> <br> <br>The site is at the beta stage, which started in mid-April, however, there are already more than 300 registered <i> users </i> here as well as a small number of <i> regular members </i>. Daily attendance is about <u> 100 people </u> (mostly mimocrocodiles, the rest are <b> anonymous anonymous with anonymous imageboards </b>). </p> <a href = "javascript: $ (\'. Aboutchat \'). addClass (\' hidden \'); $ (\' # auth \'). removeClass (\' hidden \') "class =" aboutok ">OK</a>',
                    '%%([^%]+)%%':'$1'}
                ));
        });
    };
    next();
})



// Создаеем соединение с mysql
// --------------------------------------------------------------------------
var mysql = require('mysql');
var connection = mysql.createConnection(db_settings);

connection.config.queryFormat = function (query, values) {
    if (!values) return query;
    return query.replace(/\:(\w+)/g, function (txt, key) {
      if (values.hasOwnProperty(key)) {
        return this.escape(values[key]);
      }
        return txt;
    }.bind(this));
};

connection.connect();


// Обработка ошибок (игнорирование)
// --------------------------------------------------------------------------
process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "crawc.net"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


 /*
app.get('/bots/', function (req, res) {
    res.header("Content-Type", "text/html; charset=utf-8");
    if (req.session.user_id == 65 && req.params.uid != 65) {
        connection.query(
'insert into users (name, sex, datebirth, city, pass) values '+
'("Света", "0", "2003-01-01", "Москва", :pass),'+
'("Катя", "0", "2002-01-01", "Москва", :pass),'+
'("Наташа", "0", "2001-01-01", "Москва", :pass),'+
'("Оля", "0", "2000-01-01", "Москва", :pass),'+
'("Машенька", "0", "1999-01-01", "Москва", :pass),'+
'("Клава", "0", "1998-01-01", "Москва", :pass),'+
'("Тян", "0", "1997-01-01", "Москва", :pass),'+
'("Из москвы", "0", "1996-01-01", "Москва", :pass),'+
'("Надежда 25", "0", "1995-01-01", "Москва", :pass),'+
'("Вирт", "0", "1994-01-01", "Москва", :pass),'+

'("katy", "0", "2003-01-01", "Санкт-Петербург", :pass),'+
'("$tervo4ka", "0", "2002-01-01", "Санкт-Петербург", :pass),'+
'("Вася", "0", "2001-01-01", "Санкт-Петербург", :pass),'+
'("Клубника", "0", "2000-01-01", "Санкт-Петербург", :pass),'+
'("мажорка", "0", "1999-01-01", "Питер", :pass),'+
'("Дочь депутата", "0", "1998-01-01", "питер", :pass),'+
'("Мороженное", "0", "1997-01-01", "Екб", :pass),'+
'("Шлюха", "0", "1996-01-01", "Екатеринбург", :pass),'+
'("Привет", "0", "1995-01-01", "Самара", :pass),'+
'("Ася", "0", "1994-01-01", "Тольятти", :pass),'+

'("Звезданутая", "0", "2003-01-01", "Аппатиты", :pass),'+
'("stasy", "0", "2002-01-01", "Хабаровск", :pass),'+
'("lena", "0", "2001-01-01", "London", :pass),'+
'("Аниме", "0", "2000-01-01", "Киев", :pass),'+
'("Секретарша", "0", "1999-01-01", "Севастополь", :pass),'+
'("Вероника 20", "0", "1998-01-01", "не важно", :pass),'+
'("WooHoo", "0", "1997-01-01", "Александров", :pass),'+
'("школьница", "0", "1996-01-01", "город дорог", :pass),'+
'("Танцулька", "0", "1995-01-01", "живу в деревне", :pass),'+
'("Винишко", "0", "1994-01-01", "Tokyo", :pass),'+

'("Транси", "0", "2003-01-01", "", :pass),'+
'("Руна", "0", "2002-01-01", "", :pass),'+
'("Емо-девочка", "0", "2001-01-01", "", :pass),'+
'("конфетка", "0", "2000-01-01", "", :pass),'+
'("love", "0", "1999-01-01", "", :pass),'+
'("Училка", "0", "1998-01-01", "", :pass),'+
'("секси", "0", "1997-01-01", "", :pass),'+
'("Virgin", "0", "1996-01-01", "", :pass),'+
'("я чат-бот", "0", "1995-01-01", "", :pass),'+
'("Конец света", "0", "1994-01-01", "", :pass);',
            {pass:md5_salt('whorewhore')},
            function (error, results, fields) {
                res.end(JSON.stringify({e:error, r:results, f:fields}));
            }
        );
    }
});
*/


app.get('/ban/:uid', function (req, res) {
    if (req.session.user_id == 65 && req.params.uid != 65) {
        connection.query(
            'delete from rooms_messages where user_id=:uid; '+
            'delete from users_messages where from_id=:uid; '+
            'update users set ban=1 where id=:uid; ',
            {uid:req.params.uid},
            function (error, results, fields) {
                res.end(JSON.stringify({e:error, r:results, f:fields}));
            }
        );
    }
});

app.get('/captcha_login', function (req, res) {
    var captcha = svgCaptcha.create();
    req.session.captcha_login = captcha.text;
    
    res.type('svg');
    res.status(200).send(captcha.data);
});

app.get('/captcha', function (req, res) {
    var captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;
    
    res.type('svg');
    res.status(200).send(captcha.data);
});

app.get('/raygun/', function(req, res) {
    res.html('bb', global_lang);
});

app.get('/raygun/:path', function(req, res) {
    res.html('bb', global_lang);
});

// Комнатные стили
app.get('/roomstyle/:room.css', function(req, res) {
    connection.query(
        'SELECT css FROM rooms WHERE id = :room LIMIT 1',
        {room:req.params.room},
        function(error, results, fields) {
            res.end(results[0]['css'])
        }
    );
});


// Site Map
app.get('/sitemap.xml', function(req, res) {
    connection.query(
        'select r.room as room, r.lang as lang, r.pwd as pwd, rm.room_id as id, max(rm.date) as udate from rooms_messages rm inner join rooms r on r.id = rm.room_id and r.pwd="" group by rm.room_id order by r.lang, rm.room_id limit :limit;',
        {limit:100},
        function(error, results, fields) {
            console.log(this.sql);
            $res = '<?xml version="1.0" encoding="UTF-8"?>\n\
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
$res += '\n\
  <url>\n\
    <loc>https://crawc.net</loc>\n\
    <lastmod>2020-06-30</lastmod>\n\
  </url>';
            $res += '\n\
  <url>\n\
    <loc>https://crawc.net/en/</loc>\n\
    <lastmod>2020-06-30</lastmod>\n\
  </url>';
            $res += '\n\
  <url>\n\
    <loc>https://crawc.net/ru/</loc>\n\
    <lastmod>2020-06-30</lastmod>\n\
  </url>';
            $res += '\n\
  <url>\n\
    <loc>https://crawc.net/404/</loc>\n\
    <lastmod>2020-06-30</lastmod>\n\
  </url>';
            for (i=0;i<results.length;i++) {
                if (results[i].pwd == "")$res += '\n\
  <url>\n\
    <loc>https://crawc.net/'+results[i].lang+'/#'+results[i].room.replaceArray({' ': '_', ':':''})+'</loc>\n\
    <lastmod>'+dateFormat(results[i].udate, 'yyyy-mm-dd')+'</lastmod>\n\
  </url>'
            }
            $res = $res + '\n\
</urlset>';
            res.end($res);
        }
            
    );
            
        
});


// Room Info
app.get('/r/', function(req, res) {
    connection.query(
        'SELECT id FROM rooms WHERE REPLACE(room, ":", "") = :roomname LIMIT 1',
        {roomname:decodeURIComponent(req.query.name).substr(1).replaceArray({'_':' ', ':.+$':''})},
        function(error, results, fields) {
            console.log(this.sql);
            res.end(JSON.stringify({id:results[0].id.toString()}))
        }
    );
});

// User Info
app.get('/uin/', function(req, res) {
    connection.query(
        'SELECT id, name FROM users WHERE name = :name LIMIT 1',
        {name:decodeURIComponent(req.query.name).substr(2).replaceArray({'_':' '})},
        function(error, results, fields) {
            if (results.length == 1) {
                console.log(this.sql);
                res.end(JSON.stringify({id:results[0]['id'],name:results[0]['name']}));
            }
        }
    );
});

// Входная точка браузера
// --------------------------------------------------------------------------
app.get('/', function(req, res) {
  res.redirect('/ru/');
});

var guest_id = 533;
app.get('/:lang/readonly', function(req, res) {
    if (req.params.lang == 'ru') global_lang = "ru";
    else if (req.params.lang == 'en') global_lang = "en";
    
    if (!req.session.user_id) req.session.user_id = guest_id;
    res.html('index', global_lang);
});


app.get('/:lang/', function(req, res) {
    
    req.session.captcha_login = '';
    req.session.captcha = '';
    
    if (req.params.lang == 'ru') global_lang = "ru";
    else if (req.params.lang == 'en') global_lang = "en";
    else if (req.params.lang == 'v2') {global_lang = "ru"; res.html('v2', global_lang)}
    else {
        res.status(404);
        res.html('404');
        return false;
    }
    
    if(req.session.user_id == guest_id) {
        res.html('login', req.params.lang);
    }
    
    var index_view = req.session.index_view ? req.session.index_view : 'index';
    var index_view = 'index';
        
    if (!isset(req.session.user_id)) {        
        if (isset(req.cookies.user_id) && isset(req.cookies.user_hash) && req.cookies.user_hash.length) {
            
            // Если нет сессии, но есть хэш в cookies
            connection.query(
                    
                'SELECT id FROM `users` WHERE `id` = :user_id AND `hash` = :user_hash limit 1',
                {user_id:req.cookies.user_id, user_hash:req.cookies.user_hash},
                function (error, results, fields) {
                    
                    if (error) {
                        // Произошла ошибка при выполнении запроса к БД
                        res.html('login', global_lang);
                    } else if (isset(results[0]) && isset(results[0].id)) {
                        // Хэш пользователя совпал
                        req.session.user_id = results[0].id;
                        res.html('index', global_lang);
                    } else {
                        // Хэш пользователя не совпал
                        res.clearCookie('user_id');
                        res.clearCookie('user_hash');
                        res.html('login', global_lang);
                    }
                    
                }
            );            
        } else {
            // Если нет ни сессии ни хэша в cookies
            res.html('login', global_lang);
        }
    } else {
        // Если есть сессия
        res.html('index', global_lang);
    }
    
});

app.get('/:lang/:page', function(req, res) {
    res.status(404);
    res.html('404');
    return false;
});



// Аватарки
// --------------------------------------------------------------------------
app.get('/img/user*+/avatar.gif', function(req, res) {
    res.redirect('/img/avatar.gif');
});

/*
app.use(function(req, res, next) {
    
    console.log(req.path);
    if(req.path.indexOf('.')) {
        if (req.session.user_id) {
            res.sendFile('/home/zxc0/crawc.net/publ'+req.path);
        } else {
            res.status(401).send('Authorization required!');
        }
    } else next();
});
*/


// Actions
// -------------------------------------------------------------------------- 
app.post('/act', urlencodedParser, function(req, res) {
    
    if (req.session.user_id == guest_id) { 
        if (["edit_profile", "logout", "removeimg"].includes(req.body.act)) {
            res.end(JSON.stringify({success:0}));
            return false;
        }
    }
    
    req.body = escapeHtml(req.body);
    
    req.session.index_view = req.body.version == 2 ? 'index' : 'index';
    req.session.index_view = 'index';
    
    req.session.hash = isset(req.session.hash) ? req.session.hash : hash();
    if (!isset(req.session.user_hashes)) {
        req.session.user_hashes = new Array();
    }
    
    var is_public_action = false;
    var public_actions = ['auth', 'reg', 'checkname'];
    
    if (public_actions.indexOf(req.body.act) >= 0)
        is_public_action = true;
    console.log(!req.session.user_id);
    console.log(is_public_action);
    console.log(public_actions.indexOf(req.body.act));
    if (!req.session.user_id && !is_public_action) {
        
        res.end(JSON.stringify({
            success: 0,
            error: 'not authorized'
        }));
        
    } else {
    
        switch(req.body.act) {

            // Проверка имени пользователя
            // ----------------------------
            case 'checkname': {
                connection.query(
                        
                    'SELECT id, hash FROM `users` WHERE `name` = :name limit 1',
                    {name:req.body.name},
                    function(error, results, fields) {
                        
                        
                        if (error) {

                            res.end(JSON.stringify({success:0}));

                        } else if (isset(results[0]) && isset(results[0].id)) {
                            
                            
                            var user_id = results[0].id;
                            var user_hash = results[0].hash;
                            
                            if (isset(req.session.user_hashes[user_id]) && results[0].hash == req.session.user_hashes[user_id]) {
                                // Пользователь есть и авторизован
                                res.end(JSON.stringify({success:1, check:1, session:1}));
                                // Пользователь есть и не авторизован
                            } else if (!isset(req.session.user_hashes[user_id]) || results[0].hash != req.session.user_hashes[user_id]) {
                                
                                res.end(JSON.stringify({success:1, check:1, session:0}));
                            }
                            

                        } else {
                            // Если логин или пароль неправильный
                            res.end(JSON.stringify({success:1, check:0}));
                        }
                    }
                );

                break;
            }
            
            
            // Авторизация
            // ----------------------------
            case 'auth': {
                    
                if (req.session.captcha_login == '' || req.body.captcha != req.session.captcha_login) {
                    req.session.captcha_login = '';
                    res.end(JSON.stringify({success:0,error:'captcha'}));
                    return false;
                }
                req.session.captcha_login = '';
                
                connection.query(

                    'SELECT id, hash FROM `users` WHERE `name` = :name AND `pass` = :md5_pass limit 1',
                    {name:req.body.name, md5_pass:md5_salt(req.body.pass)},
                    function(error, results, fields) {

                        if (error) {
                            
                            res.end(JSON.stringify({success:0}));

                        } else if (isset(results[0]) && isset(results[0].id)) {

                            // Если логин и пароль правильные
                            var user_id = results[0].id;
                            var user_hash = results[0].hash ? results[0].hash : hash();
                            req.session.user_hashes[user_id] = user_hash;
                            //req.session.hash = md5_salt(req.body.pass);
                            //req.session.user_sockets = new Array();

                            connection.query(

                                'UPDATE `users` SET `hash` = :hash WHERE pass = :md5_pass AND `id` = :id',
                                {md5_pass:req.session.hash, id:user_id, hash:user_hash},
                                function(error, result){
                                    console.log(this.sql)
                                    if(error) {
                                        console.log(error)
                                    }

                                    //if (req.body.remember_me && result.affectedRows) {
                                    req.session.user_id = user_id;
                                    res.cookie('user_id', user_id, cookie_settings);
                                    res.cookie('user_hash', user_hash, cookie_settings);
                                    
                                    
                                    //}
                                    res.end(JSON.stringify({success:1}));

                                }
                                
                            );

                        } else {
                            // Если логин или пароль неправильный
                            res.end(JSON.stringify({success:0}));
                        }
                    }
                );

                break;
            }

            // Регистрация
            // ----------------------------
            case 'reg': {           
                console.log(reg);
                connection.query(

                    'SELECT `id`, `name`, `email` FROM `users` WHERE `name` = :nickname limit 1',
                    {nickname:req.body.nickname},
                    function(error, results, fields) {

                        if (error) {
                            console.log(error);
                            console.log(this.sql);
                            res.end(JSON.stringify({success:0}));

                        } else {

                            var reg_err = new Array();

                            //if (!/[^\s]+@[^\s]+/.test(req.body.email) && req.body.email.length <= 255) reg_err.push('email');
                            if (!/[^\s]{3,16}/.test(req.body.nickname)) reg_err.push('nickname');

                            if (req.body.password.length < 6 || req.body.password != req.body.password2) {
                                reg_err.push('password');
                                reg_err.push('password2');
                            }

                            if (isset(results[0])) {                    
                                if (results[0].name == req.body.nickname && reg_err.indexOf('nickname') != -1) reg_err.push('nickname');
                            }

                            if (reg_err.length) {

                                // Если есть ошибки при заполнении формы
                                res.end(JSON.stringify({success:0, error:reg_err}));

                            } else {

                                // Если ошибок нет и пользователя можно зарегистрировать
                                var user_hash = hash();

                                connection.query(

                                    'INSERT INTO `users` (name, sex, email, city, datebirth, aboutme, pass, hash) ' +
                                    'VALUES (:name, :sex, :email, :city, :datebirth, :aboutme, :md5_pass, :hash)',
                                    { name: req.body.nickname,
                                      sex: req.body.sex,
                                      email: req.body.email,
                                      fio: req.body.fullname,
                                      city: req.body.city,
                                      datebirth: req.body.datbirth,
                                      aboutme: req.body.aboutme,
                                      md5_pass: md5_salt(req.body.password),
                                      hash: user_hash},
                                    function(error, result) {
                                        
                                        console.log(this.sql);

                                        if (error) {
                                            console.log(error)
                                            res.end(JSON.stringify({success:0}));
                                        } else {
                                            
                                            if (req.body.avatar.substr(0, 10) == 'data:image') {
                                                var base64Data = req.body.avatar.replace(/^data:image\/[a-z]+;base64,/,"");
                                                var binaryData = new Buffer(base64Data, 'base64').toString('binary');
                                                fs.mkdir(base_path+'public/img/user'+result.insertId, 0777, function(err) {
                                                    if (!err) {
                                                        fs.writeFile(base_path+'public/img/user'+result.insertId+'/avatar.gif', binaryData, "binary", function(err) {
                                                            console.log(err);
                                                            paths = {
                                                                fileName: 'avatar.gif',
                                                                srcPath: base_path+'public/img/user'+result.insertId+'/avatar.gif',
                                                                dstPath: base_path+'public/img/user'+result.insertId+'/avatar.gif',
                                                                width:   100,
                                                                height: 100,
                                                                quality: 1,
                                                              };
                                                            im.resize(paths, function(err, stdout, stderr){});
                                                        });
                                                        
                                                        
                                                        fs.mkdir(base_path+'public/img/user'+result.insertId+'/photos', 0777, function(err) {
                                                            console.log(err);
                                                            fs.mkdir(base_path+'public/img/user'+result.insertId+'/photos/full', 0777, function(err) {});
                                                            fs.mkdir(base_path+'public/img/user'+result.insertId+'/photos/min', 0777, function(err) {});
                                                        });
                                                    } else {
                                                        console.log(err);
                                                    }
                                                });
                                            }
                                            
                                            req.session.user_id = result.insertId;
                                            res.cookie('user_id', result.insertId, cookie_settings);
                                            res.cookie('user_hash', user_hash, cookie_settings);
                                            res.end(JSON.stringify({success:1}));
                                        }

                                    }
                                );

                            }

                        }
                    }
                );

                break;
            }
            
            // Редактирование анкеты
            // ----------------------------
            case 'edit_profile': {
                    
                ico = (req.body.ico.length == 1) ? req.body.ico : "";
                
                connection.query(
                        
                        'UPDATE users SET '+
                        'sex=:sex, email=:email, city=:city, datebirth=:datebirth, aboutme=:aboutme, ico=:ico '+
                        'WHERE id=:user_id',
                
                        {sex:req.body.sex, email:req.body.email, city:req.body.city, datebirth:req.body.datebirth, aboutme:req.body.aboutme, ico:ico, user_id:req.session.user_id},
                        
                        function(error, result) {
                            
                            if (error) {
                                console.log(error)
                                res.end(JSON.stringify({success:0}));
                            } else {

                                if (req.body.avatar.substr(0, 10) == 'data:image') {
                                    var base64Data = req.body.avatar.replace(/^data:image\/[a-z]+;base64,/,"");
                                    var binaryData = new Buffer(base64Data, 'base64').toString('binary');
                                    
                                    fs.writeFile(base_path+'public/img/user'+req.session.user_id+'/avatar.gif', binaryData, "binary", function(err) {
                                        console.log(err);
                                        paths = {
                                            fileName: 'avatar.gif',
                                            srcPath: base_path+'public/img/user'+req.session.user_id+'/avatar.gif',
                                            dstPath: base_path+'public/img/user'+req.session.user_id+'/avatar.gif',
                                            width:   100,
                                            height: 100,
                                            quality: 1,
                                          };
                                        im.resize(paths, function(err, stdout, stderr){});
                                    });
                                }

                                res.end(JSON.stringify({success:1}));
                            }
                            
                        }
                );
                    
                break;
            }

            // Выход
            // ----------------------------
            case 'logout': {
                res.cookie('user_id', 0, cookie_settings);
                res.cookie('user_hash', 0, cookie_settings);
                //res.clearCookie('user_id');
                //res.clearCookie('user_hash');
                res.clearCookie('connect.sid');
                res.clearCookie('hash');
                req.session.user_id = 0;
                req.session.destroy();
                res.end(JSON.stringify({'success':1}));
                break;
            }
            
            // Удаление фото
            // ----------------------------
            case 'removeimg': {
                
                connection.query(
                        'SELECT user_id, path FROM users_photos WHERE id=:pid AND user_id=:user_id; '+
                        'DELETE FROM users_photos WHERE id=:pid AND user_id=:user_id; ',
                        {pid:req.body.pid, user_id:req.session.user_id},
                        function(err, result) {
                            if(!err && result[0][0]) {
                                fs.unlink('/home/zxc0/crawc.net/public/img/user'+result[0][0].user_id+'/photos/min/'+result[0][0].path);
                                fs.unlink('/home/zxc0/crawc.net/public/img/user'+result[0][0].user_id+'/photos/full/'+result[0][0].path);
                                res.end();
                            }
                        }
                );
                        
                break;
            }
            
      

            // Список комнат
            // ----------------------------
            case 'get_rooms': {

                var rooms = new Array();
                var q = connection.escape(req.body.q).substr(1, req.body.q.length).toLowerCase();
                var lang = req.body.lang.replaceArray({'[^a-z0-9]':''});
                var page = parseInt(req.body.page);
                var limit = parseInt(req.body.limit) || 10;
                var start = page * limit;

                connection.query(

                    // Получаем страницу списка комнат
                    'select rooms.room as room, rooms.id as room_id, rooms.lang as lang, if(char_length(rooms.pwd), 1, 0) as locked, (count(distinct sockets.user_id)+rooms.bots) as cnt, count(distinct rm.id) as mcnt, (max(rm.id)>bookmarks.message_id) as bm, rooms.img as img ' +
                    'from rooms ' +
                    'left join bookmarks on rooms.id=bookmarks.room_id AND bookmarks.user_id='+parseInt(req.session.user_id)+' '+
                    'left join rooms_messages rm on rooms.id = rm.room_id '+
                    'left join sockets_in_rooms ON rooms.id = sockets_in_rooms.room_id ' +
                    'left join sockets on sockets_in_rooms.socket_id = sockets.id '+
                    (q.length ? ('where rooms.room LIKE "%' + q + '%" AND rooms.lang="'+lang+'" ') : 'where rooms.lang="'+lang+'" ') +
                    'group by rooms.id ' +
                    'order by cnt desc, rooms.id ' +
                    'limit ' + start + ', ' + limit + '; ' +

                    // Получаем количество записей по запросу
                    'select count(rooms.id) as cnt ' +
                    'from rooms ' +
                    (q.length ? ('where rooms.room LIKE "%' + q + '%"  AND rooms.lang="'+lang+'" ') : 'where rooms.lang="'+lang+'" '),

                    function (error, results, fields) {
                        console.log(this.sql);
                        if (!error) {
                            var rooms = results[0];
                            var pages_count = Math.ceil(results[1][0].cnt/limit);
                            res.end(JSON.stringify({
                                success: 1,
                                rooms: rooms,
                                page: page,
                                pages_count: pages_count
                            }));
                        } else {
                            console.log(this.sql)
                            console.log(error);
                            res.end(JSON.stringify({success:0}));
                        }

                    }
                );

                break;
            }

            // Undefined action
            // ----------------------------
            default: {
                res.end(JSON.stringify({
                    success: 0,
                    error: 'undefined action'
                }));
            }
        }
        
    }
        
});



app.post('/reg',  function(req,res){
    
    console.log("reg post");
    
    if(req.session.captcha ==  '' || req.session.captcha != req.body.captcha) {
        req.session.captcha = '';
        res.end(JSON.stringify({success:0, error:['captcha']}));
        return false;
    }
    req.session.captcha = '';
    
    
    req.body = escapeHtml(req.body);
                        
    connection.query(

        'SELECT `id`, `name`, `email` FROM `users` WHERE `name` = :nickname limit 1',
        {nickname:req.body.nickname},
        function(error, results, fields) {
            
            if (error) {
                console.log(error);
                console.log(this.sql);
                res.end(JSON.stringify({success:0}));

            } else {
                
                var reg_err = new Array();

                //if (!/[^\s]+@[^\s]+/.test(req.body.email) && req.body.email.length <= 255) reg_err.push('email');
                if (!/[^\s]{3,32}/.test(req.body.nickname)) reg_err.push('nickname');
                if (!/[^\s]{1,32}@[^\s]{1,32}/.test(req.body.email) && req.body.email) reg_err.push('email');

                if (req.body.password.length < 6 || req.body.password != req.body.password2) {
                    reg_err.push('password');
                    reg_err.push('password2');
                }

                if (isset(results[0])) {                    
                    if (results[0].name == req.body.nickname && reg_err.indexOf('nickname') != -1) reg_err.push('nickname');
                }

                if (reg_err.length) {

                    // Если есть ошибки при заполнении формы
                    res.end(JSON.stringify({success:0, error:reg_err}));

                } else {

                    // Если ошибок нет и пользователя можно зарегистрировать
                    var user_hash = hash();

                    connection.query(

                        'INSERT INTO `users` (name, sex, email, city, datebirth, aboutme, pass, hash) ' +
                        'VALUES (:name, :sex, :email, :city, :datebirth, :aboutme, :md5_pass, :hash)',
                        { name: req.body.nickname,
                          sex: req.body.sex,
                          email: req.body.email,
                          fio: req.body.fullname,
                          city: req.body.city,
                          datebirth: req.body.datebirth,
                          aboutme: req.body.aboutme,
                          md5_pass: md5_salt(req.body.password),
                          hash: user_hash},
                        function(error, result) {

                            console.log(this.sql);
                            

                            if (error) {
                                console.log(error)
                                res.end(JSON.stringify({success:0}));
                            } else {
                                
                                
                                fs.mkdir(base_path+'public/img/user'+result.insertId, 0777, function(err) {
                                    if (!err) {                                        
                                        fs.mkdir(base_path+'public/img/user'+result.insertId+'/photos', 0777, function(err) {
                                            console.log(err);
                                            fs.mkdir(base_path+'public/img/user'+result.insertId+'/photos/full', 0777, function(err) {});
                                            fs.mkdir(base_path+'public/img/user'+result.insertId+'/photos/min', 0777, function(err) {});
                                        });
                                        if (isset(req.body.avatar) && req.body.avatar.substr(0, 10) == 'data:image') {
                                            var base64Data = req.body.avatar.replace(/^data:image\/[a-z]+;base64,/,"");
                                            var binaryData = new Buffer(base64Data, 'base64').toString('binary');
                                            fs.writeFile(base_path+'public/img/user'+result.insertId+'/avatar.gif', binaryData, "binary", function(err) {
                                                console.log(err);                                                
                                                paths = {
                                                    fileName: 'avatar.gif',
                                                    srcPath: base_path+'public/img/user'+result.insertId+'/avatar.gif',
                                                    dstPath: base_path+'public/img/user'+result.insertId+'/avatar.gif',
                                                    width:   100,
                                                    height: 100,
                                                    quality: 1,
                                                };
                                                im.resize(paths, function(err, stdout, stderr){});
                                            });
                                            
                                        }
                                    } else {
                                        console.log(err);
                                    }
                                });
                                
                                /*
                                if (req.body.avatar.substr(0, 10) == 'data:image') {
                                    var base64Data = req.body.avatar.replace(/^data:image\/[a-z]+;base64,/,"");
                                    var binaryData = new Buffer(base64Data, 'base64').toString('binary');
                                    fs.mkdir(base_path+'public/img/user'+result.insertId, 0777, function(err) {
                                        if (!err) {
                                            fs.writeFile(base_path+'public/img/user'+result.insertId+'/avatar.gif', binaryData, "binary", function(err) {
                                                console.log(err);
                                            });
                                            fs.mkdir(base_path+'public/img/user'+result.insertId+'/photos', 0777, function(err) {
                                                console.log(err);
                                                fs.mkdir(base_path+'public/img/user'+result.insertId+'/photos/full', 0777, function(err) {});
                                                fs.mkdir(base_path+'public/img/user'+result.insertId+'/photos/min', 0777, function(err) {});
                                            });
                                        } else {
                                            console.log(err);
                                        }
                                    });
                                }
                                */
                               
                                req.session.user_id = result.insertId;
                                res.cookie('user_id', result.insertId, cookie_settings);
                                res.cookie('user_hash', user_hash, cookie_settings);
                                res.end(JSON.stringify({success:1}));
                            }

                        }
                    );

                }

            }
        }
    );

});


app.post('/upload',function(req,res){
    
    if (req.session.user_id == guest_id) { 
        res.end(JSON.stringify({success:0}));
        return false;
    }
    
    if (!req.session.user_id) res.end('You need authorize to this action');
    
    console.log('post upload');
    
    global.globalreq = req;

    var paths = [];
    var str_uploaded = [];
    var fullpath = '/home/zxc0/crawc.net/public/img/user'+req.session.user_id+'/photos/full/';
    var minpath = '/home/zxc0/crawc.net/public/img/user'+req.session.user_id+'/photos/min/';
    var fullpath_web = '/img/user'+req.session.user_id+'/photos/full/';
    var minpath_web = '/img/user'+req.session.user_id+'/photos/min/';
    
    var mysql_insert = new Array();
    
    var storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, fullpath);
      },
      filename: function (req, file, callback) {
        mimetype = '';
        if (file.mimetype == 'image/jpeg') mimetype = '.jpg';
        if (file.mimetype == 'image/png') mimetype = '.png';
        if (file.mimetype == 'image/gif') mimetype = '.gif';        
        callback(null, Date.now().toString(16)+mimetype);
      }
    });
    var upload = multer({ storage : storage }).array('photos',10);
    
    upload(req,res,function(err) {
        
        console.log(req.files);
        console.log ('upload '+req.files.length+' files')
        //console.log(req.files);
        for (i=0; i<req.files.length; i++) {
            
            paths[i] = {
                fileName: req.files[i].filename,
                srcPath: req.files[i].path,
                dstPath: minpath + req.files[i].filename,
                srcPath_web: fullpath_web + req.files[i].filename,
                dstPath_web: minpath_web + req.files[i].filename,
                width:   100,
                height: 100,
                quality: 1,
              };
            im.resize(paths[i], function(err, stdout, stderr){
                
                //console.log(paths);
                /*
                //console.log('<a href="'+paths.srcPath+'"><img src="'+paths.dstPath+'"></a>');
                for (j=0; j<req.files.length; j++) {
                    imgsize = sizeOf(paths[j].dstPath);
                    str_uploaded[j] = '<a href="'+paths[j].srcPath_web+'"><img src="'+paths[j].dstPath_web+'" width="'+imgsize.width+'" height="'+imgsize.height+'"></a>';
                }
                  
                if (i >= req.files.length-1) res.end(str_uploaded.join(''));
                  
                if (err) {
                    console.log(err);
                    throw err;
                }/*
                console.log(global.globalreq.files[i]);
                if (isset(req.files[i])) {
                    str_uploaded += '<a href="'+fullpath_web+req.files[i].filename+'"><img src="'+minpath_web+req.files[i].filename+'"></a>'
                    console.log('image has been resized');
                }
                if (i>=req.files.length-1) {
                    res.end(str_uploaded);
                }
                console.log(str_uploaded);*/
                
                if (mysql_insert.length == 0) {
                    
                    
                    
                    for (var j in paths) {
                        mysql_insert[j] = '('+parseInt(req.session.user_id)+', NOW(), '+mysql.escape(paths[j].fileName)+')';
                        //watermark.embedWatermark('/home/zxc0/crawc.net/public/img/user'+req.session.user_id+'/photos/full/'+paths[j].fileName, {text: 'web chat crawc.net', 'override-image' : true, align:'ltr', font: 'FreeSans.ttf'})
                        var wm = '/home/zxc0/crawc.net/public/watermark.png';
                        var pathTo = '/home/zxc0/crawc.net/public/img/user'+req.session.user_id+'/photos/full/'+paths[j].fileName;
                        var pathFrom = pathTo;

                        gm(pathFrom).
                        quality(100).
                        geometry(800, 800, '>').
                        gravity('SouthEast').
                        draw(['image Over 10,10 0,0 "'+wm+'"']).
                        noProfile().
                        write(pathTo, function (err) {
                            child_process.exec('exiftool -comment="web chat https://crawc.net" '+pathTo, {shell: true, encoding: 'utf8'}, function (error, stdout, stderr) {
                                if (error) {throw error;}
                                console.log('stdout: ' + stdout);
                                console.log('stderr: ' + stderr);
                            });
                        });
                        
                    }
                    console.log(mysql_insert);
                    connection.query('INSERT INTO users_photos (user_id, upload_date, path) VALUES '+mysql_insert.join(',')+'', function(err) {
                        
                        console.log(err);
                        console.log('socket_id', sid[req.session.user_id])
                        for (var i in sid[req.session.user_id]) {
                            console.log('req.session.user_id', req.session.user_id);
                            io.to(sid[req.session.user_id][i]).emit('message', {event:'uploaded_once', filename: mysql.escape(paths[j].fileName)});
                            res.end('ok');
                        }
                        
                    })
                }
                
                if (i>=req.files.length-1) {
                    //res.end();
                }
              
            });
              
        }
        if(err) {
            console.log(err);
            return res.end('Не получилось загрузить изображения');
        }
    });
    
    res.end();
});

app.post('/uploadone',function(req,res) {
    
    if (req.session.user_id == guest_id) { 
        res.end(JSON.stringify({success:0}));
        return false;
    }
    
    var minpath = '/home/zxc0/crawc.net/public/img/user'+req.session.user_id+'/photos/min/';
    var fullpath_web = '/img/user'+req.session.user_id+'/photos/full/';
    var minpath_web = '/img/user'+req.session.user_id+'/photos/min/';
    
    if (!req.session.user_id) res.end('You need authorize to this action');
    
    console.log('post upload');
    
    global.globalreq = req;

    var paths = [];
    var str_uploaded = [];
    var fullpath = '/home/zxc0/crawc.net/public/img/user'+req.session.user_id+'/photos/full/';
    
    var mysql_insert = new Array();
    
    var storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, fullpath);
      },
      filename: function (req, file, callback) {
        mimetype = '';
        if (file.mimetype == 'image/jpeg') mimetype = '.jpg';
        if (file.mimetype == 'image/png') mimetype = '.png';
        if (file.mimetype == 'image/gif') mimetype = '.gif';     
        fileName = Date.now().toString(16)+mimetype;
        callback(null, fileName);
      }
    });
    var upload = multer({ storage : storage }).single('file', 1);
    upload(req,res,function(err) {
        console.log(req.file);
        
        paths = {
            fileName: req.file.filename,
            srcPath: req.file.path,
            dstPath: minpath + req.file.filename,
            srcPath_web: fullpath_web + req.file.filename,
            dstPath_web: minpath_web + req.file.filename,
            width:   180,
            height: 180,
            quality: 1,
        };
        im.resize(paths, function(err, stdout, stderr){
            //watermark.embedWatermark(req.file.path, {text: 'web chat crawc.net', 'override-image' : true, align:'ltr', font: 'FreeSans.ttf'})
            var wm = '/home/zxc0/crawc.net/public/watermark.png';
            var pathTo = req.file.path
            var pathFrom = pathTo;

            gm(pathFrom).
            quality(100).
            geometry(800, 800, '>').
            gravity('SouthEast').
            draw(['image Over 10,10 0,0 "'+wm+'"']).
            noProfile().
            write(pathTo, function (err) {
                child_process.exec('exiftool -comment="web chat https://crawc.net" '+pathTo, {shell: true, encoding: 'utf8'}, function (error, stdout, stderr) {
                    if (error) {throw error;}
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                });
            });
            res.end(req.file.filename);
        });
    });
    
});






app.post('/voice', jsonParser, function(req,res) {
    
    console.log(req.query);
    console.log(req.file);
    console.log(req.body);
    
     if (req.session.user_id == guest_id) { 
        res.end(JSON.stringify({success:0}));
        return false;
    }
    
    var path = '/home/zxc0/crawc.net/public/img/user'+req.session.user_id+'/';
    var path_web = '/img/user'+req.session.user_id+'/';
    
    if (!req.session.user_id) res.end('You need authorize to this action');
});










// Socket server
// -------------------------------------------------------------------------- 
connection.query(
    'DELETE FROM sockets WHERE true; ' +
    'DELETE FROM sockets_in_rooms WHERE true;'
);

io.sockets.on("connection", function(socket) {
    
    
    var session = socket.request.session;
    
    sid[session.user_id] = sid[session.user_id] ? sid[session.user_id] : [];
    sid[session.user_id].push(socket.id);
    
    var fullpath = '/home/zxc0/crawc.net/public/img/user'+session.user_id+'/photos/full/';
    var minpath = '/home/zxc0/crawc.net/public/img/user'+session.user_id+'/photos/min/';
    var fullpath_web = '/img/user'+session.user_id+'/photos/full/';
    var minpath_web = '/img/user'+session.user_id+'/photos/min/';
    
    if (session.user_id) {
        
        // Если авторизован, загружаем основные данные юзера в сессию и добавляем его сокет в БД ........
        connection.query(
                
            'SELECT id, name, IF(sex, "male", "female") as sex, avatar, city, audio, email, ico, aboutme, darktheme, ban FROM users WHERE id = :user_id LIMIT 1; ' +
            'INSERT INTO sockets (user_id, socket) VALUES (:user_id, :socket_id) ON DUPLICATE KEY UPDATE user_id = :user_id, socket = :socket_id',
            {user_id: session.user_id, socket_id: socket.id},
            function (error, results, fields) {
                
                if (!error && isset(results[0]) && isset(results[0][0])) {
                    
                    var socket_insert_id = results[1].insertId;
                    
                    session.user_id = session.user_id;
                    session.user_name = results[0][0].name;
                    session.user_sex = results[0][0].sex;
                    session.user_avatar = results[0][0].avatar;
                    session.user_city = results[0][0].city;
                    session.user_email = results[0][0].email;
                    session.user_ico = results[0][0].ico;
                    session.user_about = results[0][0].aboutme;
                    session.socket_id = socket.id
                    session.rooms = new Array();
                    //session.user_sockets.push(socket.id);
                    // ........ загрузили, добавили
                    
                    socket.json.send({
                        event: 'init_user',
                        user_id: session.user_id,
                        user_name: session.user_name,
                        user_sex: session.user_sex,
                        user_email: session.user_email,
                        user_ico: session.user_ico,
                        darktheme: results[0][0].darktheme,
                        audio: results[0][0].audio
                    });
                    
                    // Socket recive message
                    // ----------------------------
                    socket.on('message', function (msg) {
                        
                            connection.query(
                                'select ban from users where id=:user_id limit 1',
                                {user_id:session.user_id},
                                function (eee, rrr, fff) {
                                    if (rrr[0].ban != 1) {
                                        // Проверка на бан
                                        
                                        
                            
                            session.user_id = session.user_id;
                            session.user_name = results[0][0].name;
                            session.user_sex = results[0][0].sex;
                            session.user_avatar = results[0][0].avatar;
                            //session.user_sockets.push(socket.id);
                            
                            
                            var msg_action = JSON.parse(msg);
                            if (msg_action.act != 'broadcast' && msg_action.act != 'broadcast_edit')
                                msg_action = escapeHtml(msg_action);
                            
                            
                            guest_name = "";
                            if (session.user_id == guest_id) { 
                                if (["save_settings", "send_message", "wall_write", "broadcast_edit", "delbroadcast", "newroom"].includes(msg_action.act)) {
                                    return false;
                                }
                                if (["send_message"].includes(msg_action.act)) {
                                    guest_name = '['+session.socket_id.substring(0, 8)+']';
                                };
                            }
                            
                            switch(msg_action.act) {
                                
                                case 'enter_the_room_v2': {
                                        
                                    connection.query(
                                        'select r.room as room, rm.id as id, rm.user_id as user_id, rm.message as message, u.name as user_name, u.avatar as user_avatar, u.sex as user_sex, rm.date as date, rm.gin as guest_name ' +
                                        'from rooms_messages rm ' +
                                        'inner join users u on u.id = rm.user_id and u.ban=0 ' +
                                        'inner join rooms r on r.id = rm.room_id and r.lang="v2" '+
                                        'where r.room = :room AND rm.isbroadcast = 0 ' +
                                        'order by id desc ' +
                                        'limit 100; ',
                                        {room:msg_action.room},
                                        function(error, results, fields) {
                                            console.log(error, results, fields);
                                            if(!error && results.length) {
                                                var channel = 'room-'+msg_action.room;
                                                socket.join(channel);
                                                socket.json.send({
                                                    event: 'add_messages',
                                                    data: results.reverse()
                                                });/*
                                                socket.to(channel).emit('message', {
                                                    event: 'add_messages',
                                                    data: results
                                                });*/
                                            }
                                        }
                                    );
                                        
                                    break;
                                }

                                // Вход в комнату
                                // ----------------------------
                                case 'enter_the_room': {
                                    
                                    connection.beginTransaction(function(err) {
                                        
                                        if (err) { throw err; }
                                        
                                        connection.query(
                                                
                                            'INSERT INTO sockets_in_rooms (socket_id, room_id, mob) VALUES (:socket_insert_id, :room_id, :mob) '+
                                            'ON DUPLICATE KEY UPDATE socket_id = :socket_insert_id, room_id = :room_id, mob = :mob; '+
                                            
                                            'select r.id as room_id, r.room as room_name, r.creator as creator_id, r.hello as room_greeting, r.ord as ord ' +
                                            'from rooms r ' +
                                            'where r.id = :room_id AND pwd = :pwd ' +
                                            'limit 1; ',
                                            
                                            {socket_insert_id: socket_insert_id, room_id: msg_action.room_id, pwd:msg_action.password?msg_action.password:'', mob:msg_action.mob},
                                            function (error, ress) {
                                                
                                                console.log('sqlerr1', error);
                                                if (error) { 
                                                    connection.rollback(function() {
                                                        
                                                    });
                                                }
                                                
                                                if (msg_action.password) pwd = msg_action.password;
                                                else pwd = '';
                                                
                                                where = 'FALSE';
                                                if (msg_action.room_id == 95) where="ub.id>=1188 AND ub.id<=1206";
                                                else if(msg_action.room_id == 93) where="ub.id>=1207 AND ub.id<=1220";
                                                else if(msg_action.room_id == 39) where="ub.id>=1221 AND ub.id<=1227 OR ub.id=1293";
                                                
                                                connection.query(

                                                    // Получаем информацию о комнате
                                                    'select r.id as room_id, r.room as room_name, r.creator as creator_id, r.hello as room_greeting ' +
                                                    'from rooms r ' +
                                                    'where r.id = :room_id AND pwd = :pwd ' +
                                                    'limit 1; ' +

                                                    // Получаем последние сообщения в комнате
                                                    'select rm.id as id, rm.user_id as user_id, rm.message as message, u.name as user_name, u.avatar as user_avatar, u.sex as user_sex, rm.date as date, rm.gin as guest_name ' +
                                                    'from rooms_messages rm ' +
                                                    'inner join users u on u.id = rm.user_id and u.ban=0 ' +
                                                    'where rm.room_id = :room_id AND rm.isbroadcast = 0 ' +
                                                    'order by id desc ' +
                                                    'limit 100; ' +

                                                    // Получаем пользователей в комнате
                                                    'SELECT u.id as user_id, u.name as user_name, IF(u.sex, "male", "female") as user_sex, u.ico as user_ico, u.aboutme as user_about, s.socket as socket, sir.mob as mob '+
                                                    'FROM users u '+
                                                    'INNER JOIN sockets s ON s.user_id = u.id '+
                                                    'INNER JOIN sockets_in_rooms sir ON sir.socket_id = s.id AND sir.room_id = :room_id '+
                                                    'GROUP BY user_id '+
                                                    'UNION SELECT ub.id as user_id, ub.name as user_name, IF(ub.sex, "male", "female") as user_sex, ub.ico as user_ico, ub.aboutme as user_about, "" as socket, 0 as mob '+
                                                    'FROM users ub WHERE '+where+' '+
                                                    'ORDER BY user_ico DESC, user_sex DESC, user_name ASC; ' +
                                                    
                                                    // Получаем последние вещания в комнате
                                                    'select rm.id as id, rm.rang as rang, rm.message as message, rm.broadcast_color as color, rm.broadcast_textcolor as textcolor, rm.room_id as room_id ' +
                                                    'from rooms_messages rm ' +
                                                    'where rm.room_id = :room_id AND rm.isbroadcast=1 ' +
                                                    'order by field (rm.id, '+ress[1][0].ord+') DESC ' +
                                                    'limit 20; ',

                                                    {room_id:msg_action.room_id, pwd:msg_action.password},

                                                    function(error, results, fields) {
                                                        
                                                        console.log('sqlerr2', error);
                                                        if (error) { 
                                                            connection.rollback(function() {
                                                                
                                                            });
                                                        } else if (!isset(results[0][0])) {
                                                            connection.rollback(function() {
                                                                
                                                            });
                                                        } else {
                                                            
                                                            session.rooms[results[0][0].room_id] = true;
                                                            
                                                            connection.commit(function(err) {
                                                                if (err) { 
                                                                    
                                                                }
                                                            });
                                                            
                                                            var users_objs = new Array()
                                                            for (var i in results[2]) {
                                                                user = {
                                                                    user_id: results[2][i].user_id,
                                                                    user_name: results[2][i].user_name,
                                                                    sex: results[2][i].user_sex,
                                                                    ico: results[2][i].user_ico,
                                                                    about: results[2][i].user_about,
                                                                    mob: results[2][i].mob
                                                                }
                                                                users_objs.push(user);
                                                            }
                                                            
                                                            var channel = 'room'+results[0][0].room_id;
                                                            socket.join(channel);
                                                            
                                                            socket.json.send({
                                                                event: 'client_enter_the_room',
                                                                room_id: results[0][0].room_id,
                                                                room:{
                                                                    info: results[0][0],
                                                                    messages: results[1].reverse(),
                                                                    broadcast: results[3].reverse(),
                                                                    users: users_objs
                                                                },
                                                            });
                                                            
                                                            

                                                            socket.to(channel).emit('message', {
                                                                event: 'client_enter_the_room',
                                                                room_id: results[0][0].room_id,
                                                                user: {
                                                                    user_id: session.user_id,
                                                                    user_name: session.user_name,
                                                                    sex: session.user_sex,
                                                                    ico: session.user_ico,
                                                                    about:session.user_about,
                                                                    mob: msg_action.mob
                                                                }
                                                            });

                                                        }
                                                    }

                                                );
                                            }
                                        );
                                    
                                    });
                                    
                                    break;
                                }
                                
                                // Выход из комнаты
                                // ----------------------------
                                case 'leave_the_room': {
                                    
                                    connection.query(
                                            
                                        // Получаем количество сокетов пользователя в комнате
                                        'SELECT count(sir.id) as cnt ' +
                                        'FROM sockets s ' +
                                        'INNER JOIN sockets_in_rooms sir ON sir.socket_id = s.id AND sir.room_id = :room_id '+
                                        'WHERE s.user_id = :user_id;',

                                        {room_id:msg_action.room_id, user_id:session.user_id},

                                        function (error, results, fields) {
                                            if (!error) {

                                                connection.query(                                            
                                                    'DELETE sir.* FROM sockets_in_rooms sir ' +
                                                    'INNER JOIN sockets s ON s.id = sir.socket_id AND s.user_id = :user_id AND s.socket = :socket_id ' +
                                                    'WHERE sir.room_id = :room_id',
                                                    {user_id: session.user_id, socket_id: socket.id, room_id: msg_action.room_id},
                                                    function (err, res) {
                                                        console.log(err);
                                                        if (!err && res.affectedRows) {
                                                            
                                                            socket.json.send({
                                                                event: 'client_leave_the_room',
                                                                room_id: msg_action.room_id
                                                            });
                                                            
                                                            if (results[0].cnt == 1) {
                                                                
                                                                var channel = 'room'+msg_action.room_id;
                                                                socket.leave(channel);
                                                                
                                                                socket.to(channel).emit('message', {
                                                                    event: 'client_leave_the_room',
                                                                    room_id: msg_action.room_id,
                                                                    user_id: session.user_id
                                                                });
                                                                
                                                            }

                                                        }
                                                    }
                                                );

                                            }
                                        }
                                    );
                                    
                                    break;
                                }
                                
                                // Сохраняем настройки
                                // ----------------------------
                                case 'save_settings': {
                                    connection.query(
                                        
                                        'UPDATE users SET audio=:enabled, darktheme=:dark WHERE users.id=:user_id',
                                        {enabled:msg_action.enabled, dark:msg_action.dark, user_id:session.user_id},
                                        function(error, results, fields) {
                                            console.log(error);
                                        }
                                                
                                    );
                                }
                                
                                
                                
                                case 'bookmark': {
                                        connection.query(
                                                'INSERT INTO bookmarks (user_id, room_id, message_id) VALUES '+
                                                '(:uid, :rid, :mid) '+
                                                'ON DUPLICATE KEY UPDATE '+
                                                'user_id = :uid, '+
                                                'room_id = :rid, '+
                                                'message_id= :mid ',
                                                {uid:session.user_id, rid:msg_action.room_id, mid:msg_action.message_id},
                                                function(error, results, fields) {
                                                    if (error) console.log(error);
                                                }
                                        );

                                        break;
                                }
                                
                                // Последнее прочитанное сообщение пользователем от пользователя
                                // ----------------------------
                                case 'lrm': {
                                    connection.query(
                                            
                                        'INSERT INTO users_last_readed_messages (from_id, to_id, lrm_id) VALUES '+
                                        '(:from_id, :to_id, :lrm_id) '+
                                        'ON DUPLICATE KEY UPDATE '+
                                        'from_id = :from_id, '+
                                        'to_id = :to_id, '+
                                        'lrm_id= :lrm_id ',
                                        
                                        {from_id:msg_action.user_id, to_id:session.user_id, lrm_id:msg_action.message_id},
                                        
                                        function(error, results, fields) {
                                            console.log(this.sql);
                                            console.log(error, 'null0');
                                        }
                                    );
                                    break;
                                }
                                
                                
                                
                                
                                case 'keyboard': {
                                    
                                    uid = parseInt(msg_action.user_id);
                                    rid = parseInt(msg_action.room_id);
                                    if (uid>0) {
                                        connection.query(
                                            'SELECT u.id as user_id, s.socket as socket_id FROM users u ' +
                                            'LEFT JOIN sockets s on u.id = s.user_id '+
                                            'WHERE u.id = :user_id',
                                            {user_id:uid},
                                            function(error, results, fields) {
                                                console.log(this.sql, results)
                                                if (!error && isset(results[0])) {
                                                    
                                                    for (var i in results) {
                                                        
                                                        socket.to(results[i].socket_id).emit('message', {
                                                            event: 'keyboard',
                                                            rid:0,
                                                            uid:session.user_id,
                                                            uname:session.user_name
                                                        });
                                                        
                                                    }
                                                    
                                                }
                                            }
                                        );
                                    } else if (rid>0) {
                                        
                                        io.in('room'+rid).emit('message', {
                                            event: 'keyboard',
                                            rid: rid,
                                            uid:session.user_id,
                                            uname:session.user_name
                                        });
                                        
                                    }
                                        
                                    break;
                                }
                                
                                
                                case 'send_message_v2': {
                                        console.log('v2');
                                        
                                    prepared_message = prepare(msg_action.message, session.user_id, '\n');
                                    
                                    if (prepared_message.substring(0, 5) == "КВЕСТ") prepared_message = quest(prepared_message);
                                    
                                    if (msg_action.to.to == 'room' && prepared_message.length) {
                                        
                                        if (prepared_message.lenght > 10000 && prepared_message.indexOf('data:audio/wav;base64') == -1)
                                            return false;
                                        console.log('v3');
                                        connection.query(
                                            'SELECT id FROM rooms WHERE room = :room and lang="v2" LIMIT 1',
                                            {room:msg_action.room},
                                            function(error, results, fields) {
                                                
                                                console.log(this.sql, error);
                                                
                                                if (!error && isset(results[0])) {
                                                    
                                                    marker = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
                                                    marker = marker.substring(0, 18)+'0';
                                                    
                                                    connection.query(
                                                        'INSERT INTO rooms_messages (room_id, user_id, message, ip, date, marker) '+
                                                        'VALUES (:room_id, :user_id, :message, :ip, NOW(), :marker)',
                                                        {room_id: results[0].id, user_id: session.user_id, message: prepared_message, ip:socket.handshake.address, marker:marker},
                                                        function(err, res) {
                                                            console.log(err, res);
                                                            if (!err) {
                                                                
                                                                io.in('room-'+msg_action.room).emit('message', {
                                                                    event: 'add_message',
                                                                    data: {
																		room:msg_action.room,
                                                                        id: res.insertId,
                                                                        user_id: session.user_id,
                                                                        user_name: session.user_name,
                                                                        user_avatar: session.user_avatar,
                                                                        user_sex: session.user_sex,
                                                                        message: prepared_message,
                                                                        date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
                                                                    }
                                                                });
                                                                
                                                                console.log(session)
                                                                
                                                            }
                                                        }
                                                    );
                                                    
                                                }
                                            }
                                        );
                                        
                                    }
                                    
                                    break;
                                }
                                
                                // Отправка сообщения
                                // ----------------------------
                                case 'send_message': {
                                        
                                        
                                    
                                    var prepared_message = prepare(msg_action.message, session.user_id, '\n');
                                    
                                    if (prepared_message.substring(0, 5) == "КВЕСТ") prepared_message = quest(prepared_message);
                                        
                                    if (msg_action.to.to == 'dialog' && prepared_message.length) {
                                        
                                         connection.query(
                                            'SELECT u.id as user_id, s.socket as socket_id FROM users u ' +
                                            'LEFT JOIN sockets s on u.id = s.user_id '+
                                            'WHERE u.id = :user_id',
                                            {user_id:msg_action.to.id},
                                            function(error, results, fields) {
                                                if (!error && isset(results[0])) {
                                                  
                                                    connection.query(
                                                        'INSERT INTO users_messages (from_id, to_id, message, ip, date, gin) ' +
                                                        'VALUES (:from_id, :to_id, :message, :ip, NOW(), :gin)',
                                                        {from_id: session.user_id, to_id: msg_action.to.id, message: prepared_message, ip:socket.handshake.address, gin:guest_name},
                                                        function(err, res) {
                                                            
                                                            console.log(err);
                                                            if (!err) {
                                                                                                                                
                                                                socket.json.send({
                                                                    event: 'new_message',
                                                                    to: msg_action.to,
                                                                    message: {
                                                                        id: res.insertId,
                                                                        user_id: session.user_id,
                                                                        user_name: session.user_name,
                                                                        guest_name: guest_name,
                                                                        user_avatar: session.user_avatar,
                                                                        user_sex: session.user_sex,
                                                                        message: prepared_message,
                                                                        date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
                                                                    }
                                                                });
                                                                
                                                                for (var i in results) {
                                                                    socket.to(results[i].socket_id).emit('message', {
                                                                        event: 'new_message',
                                                                        to: msg_action.to,
                                                                        message: {
                                                                            id: res.insertId,
                                                                            user_id: session.user_id,
                                                                            user_name: session.user_name,
                                                                            guest_name: guest_name,
                                                                            user_avatar: session.user_avatar,
                                                                            user_sex: session.user_sex,
                                                                            message: prepared_message,
                                                                            date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
                                                                        }
                                                                    });
                                                                }
                                                                
                                                            }
                                                        }
                                                    );
                                                    
                                                } else {
                                                    console.log(error, results);
                                                }
                                            }
                                        );
                                        
                                    } else if (msg_action.to.to == 'room' && prepared_message.length && session.rooms[msg_action.to.id] == true) {
                                        
                                        if (prepared_message.lenght > 10000 && prepared_message.indexOf('data:audio/wav;base64') == -1)
                                            return false;
                                        
                                        connection.query(
                                            'SELECT id FROM rooms WHERE id = :room_id LIMIT 1',
                                            {room_id:msg_action.to.id,},
                                            function(error, results, fields) {
                                                
                                                console.log(this.sql);
                                                
                                                if (!error && isset(results[0])) {
                                                    
                                                    marker = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
                                                    marker = marker.substring(0, 18)+'0';
                                                    
                                                    connection.query(
                                                        'INSERT INTO rooms_messages (room_id, user_id, message, ip, date, marker, gin) '+
                                                        'VALUES (:room_id, :user_id, :message, :ip, NOW(), :marker, :gin)',
                                                        {room_id: msg_action.to.id, user_id: session.user_id, message: prepared_message, ip:socket.handshake.address, marker:marker, gin:guest_name},
                                                        function(err, res) {
                                                            if (!err) {
                                                                
                                                                io.in('room'+msg_action.to.id).emit('message', {
                                                                    event: 'new_message',
                                                                    to: msg_action.to,
                                                                    message: {
                                                                        id: res.insertId,
                                                                        user_id: session.user_id,
                                                                        user_name: session.user_name,
                                                                        guest_name: guest_name,
                                                                        user_avatar: session.user_avatar,
                                                                        user_sex: session.user_sex,
                                                                        message: prepared_message,
                                                                        date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
                                                                    }
                                                                });
                                                                
                                                            }
                                                        }
                                                    );
                                                    
                                                }
                                            }
                                        );
                                        
                                    }
                                    
                                    break;
                                }
                                
                                // Просмотр анкеты
                                // ----------------------------
                                case 'anketa': {
                                    
                                    switch (msg_action.anketa_section) {
                                        
                                        case 'feed':
                                        break;
                                        
                                        case 'photos':
                                        break;
                                        
                                        case 'friend':
                                        break;
                                        
                                        default: {
                                            
                                            connection.query(
                                                'SELECT id, name, fio, sex, IF(datebirth, datebirth, "1900-01-01") as datebirth, city, aboutme, pattern, bg '+
                                                'FROM users WHERE id=:user_id LIMIT 1',
                                                {user_id:msg_action.user_id},
                                                function (err, res) {
                                                    if (!err && res) {
                                                        res[0].datebirth0 = dateFormat(res[0].datebirth, 'yyyy-mm-dd');
                                                        res[0].datebirth = dateFormat(res[0].datebirth, 'dd.mm.yyyy');
                                                        var posts = new Array();
                                                        connection.query(
                                                            'SELECT uf.*, u.name '+
                                                            'FROM users_feed uf '+
                                                            'INNER JOIN users u ON u.id = uf.author_id '+
                                                            'WHERE uf.user_id=:user_id AND uf.parent_id=0 AND uf.deleted=0 '+
                                                            'ORDER BY uf.id DESC '+
                                                            'LIMIT 10',
                                                            {user_id:msg_action.user_id},
                                                            function(err1, res1) {                                            
                                                                if (!err1) { 
                                                                    
                                                                    socket.json.send({
                                                                        event: 'anketa_open',
                                                                        data: {profile:res[0], posts:res1, visa:msg_action.visa}
                                                                    });
                                                                    
                                                                }
                                                            }
                                                        );
                                                        
                                                    }
                                                }
                                            );
                                            
                                            break;
                                        }
                                    }
                                    
                                    break;
                                }
                                
                                // Запись на стену
                                // ----------------------------
                                case 'wall_write': {
                                    
                                    connection.query(
                                        'INSERT INTO `users_feed` (user_id, author_id, content) ' +
                                        'VALUES (:user_id, :author_id, :content)',
                                        {user_id: msg_action.data.user_id, author_id: session.user_id, content:prepare(msg_action.data.content)},
                                        function (err, res) {
                                            if (!err) {
                                                connection.query(
                                                    'SELECT uf.id, uf.user_id, uf.content, uf.posted, uf.child_count, u.name FROM users_feed uf '+
                                                    'INNER JOIN users u ON uf.user_id = u.id '+
                                                    'WHERE uf.id > :post_id AND uf.parent_id = 0 AND uf.deleted = 0 '+
                                                    'ORDER BY uf.id DESC',
                                                    {post_id:msg_action.data.post_id},
                                                    function (err1, res1) {
                                                        console.log(err);
                                                        if (!err1) {
                                                            for (var i in res1) {
                                                                res1[i].posted = dateFormat(res1[i].posted, 'd mmmm yyyy');
                                                            }
                                                            socket.json.send({
                                                                event: 'wall_update',
                                                                data: res1.reverse()
                                                            });
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                    
                                    break;
                                }
                                
                                
                                // Запись на стену чата
                                // ----------------------------
                                case 'broadcast': {
                                    prepared_message = prepare(msg_action.message, session.user_id, '\n', true);
                                    prepared_message = prepare_broadcast(prepared_message);
                                    msg_acttion = escapeHtml(msg_action);
                                    
                                    connection.query(
                                            'SELECT id, creator FROM rooms WHERE id = :room_id LIMIT 1',
                                            {room_id:msg_action.room_id},
                                            function(error, results, fields) {
                                                if (!error && isset(results[0]) && results[0].creator==session.user_id) {
                                                    
                                                    connection.query(
                                                        'INSERT INTO rooms_messages (room_id, user_id, message, broadcast_color, broadcast_textcolor, isbroadcast, date) '+
                                                        'VALUES (:room_id, :user_id, :message, :color, :textcolor, 1, NOW())',
                                                        {room_id: msg_action.room_id, user_id: session.user_id, message: prepared_message, color:msg_action.color, textcolor:msg_action.textcolor},
                                                        function(err, res) {
                                                            console.log(err, res);
                                                            if (!err) {
                                                                io.in('room'+msg_action.room_id).emit('message', {
                                                                    event: 'new_message',
                                                                    to: {to:'room', id:msg_action.room_id},
                                                                    message: {
                                                                        id: res.insertId,
                                                                        user_id: session.user_id,
                                                                        user_name: session.user_name,
                                                                        user_avatar: session.user_avatar,
                                                                        message: prepared_message,
                                                                        date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
                                                                        isbroadcast: 1,
                                                                        color: msg_action.color,
                                                                        textcolor: msg_action.textcolor
                                                                    }
                                                                });
                                                                
                                                            }
                                                        }
                                                    );
                                                    
                                                }
                                            }
                                    );
                                    
                                    break;
                                }
                                
                                // Редактирование записи на стене чата
                                // ----------------------------
                                case 'broadcast_edit': {
                                    prepared_message = prepare(msg_action.message, session.user_id, '\n', true);
                                    prepared_message = prepare_broadcast(prepared_message);
                                    msg_acttion = escapeHtml(msg_action);
                                    
                                    connection.query(
                                            'SELECT id, creator FROM rooms WHERE id = :room_id LIMIT 1',
                                            {room_id:msg_action.room_id},
                                            function(error, results, fields) {
                                                if (!error && isset(results[0]) && results[0].creator==session.user_id) {
                                                    
                                                    connection.query(
                                                        'UPDATE rooms_messages SET message=:message, broadcast_color=:b, broadcast_textcolor=:t WHERE id=:rmid AND room_id=:room_id',
                                                        {message: prepared_message, b:msg_action.b, t:msg_action.t, rmid:msg_action.rmid, room_id:msg_action.room_id},
                                                        function(err, res) {
                                                            
                                                            if (!err && res.affectedRows) {
                                                                io.in('room'+msg_action.room_id).emit('message', {
                                                                    event: 'editted_broadcast',
                                                                    to: {to:'room', id:msg_action.room_id},
                                                                    message: {
                                                                        rmid: msg_action.rmid,
                                                                        message: prepared_message,
                                                                        color: msg_action.b,
                                                                        textcolor: msg_action.t
                                                                    }
                                                                });
                                                                
                                                            }
                                                        }
                                                    );
                                                    
                                                }
                                            }
                                    );
                                    
                                    break;
                                }
                                
                                
                                // Удаление записи со стены чата
                                // ----------------------------
                                case 'delbroadcast': {
                                        
                                    connection.query(
                                            'SELECT id, creator FROM rooms WHERE id = :room_id LIMIT 1',
                                            {room_id:msg_action.room_id},
                                            function(error, results, fields) {
                                                if (!error && isset(results[0]) && results[0].creator==session.user_id) {
                                                    
                                                    connection.query(
                                                        'DELETE FROM rooms_messages '+
                                                        'WHERE id=:message_id AND room_id=:room_id AND isbroadcast=1',
                                                        {message_id: msg_action.message_id, room_id: msg_action.room_id},
                                                        function(err, res) {
                                                            
                                                            if (!err) {
                                                                io.in('room'+msg_action.room_id).emit('message', {
                                                                    event: 'del_message',
                                                                    to: {to:'room', id:msg_action.room_id},
                                                                    message: {
                                                                        room_id: msg_action.room_id,
                                                                        message_id: msg_action.message_id
                                                                    }
                                                                });
                                                                
                                                            }
                                                        }
                                                    );
                                                    
                                                }
                                            }
                                    );
                                    
                                    break;
                                }
                                
                                // Редактирование CSS
                                // ----------------------------
                                case 'savecss': {
                                    connection.query(
                                            'SELECT id, creator FROM rooms WHERE id = :room_id LIMIT 1',
                                            {room_id:msg_action.room_id},
                                            function(error, results, fields) {
                                                if (!error && isset(results[0]) && results[0].creator==session.user_id) {
                                                    newroomname = msg_action.newname.replaceArray({':':''});
                                                    connection.query(
                                                        'UPDATE rooms SET css=:css, room=:room, pwd=:pwd WHERE id=:room_id',
                                                        {css:msg_action.csscode, room:newroomname, pwd:msg_action.pwd, room_id:msg_action.room_id},
                                                        function(err, res) {
                                                            console.log('savecsserr:', err);
                                                            if (!err && res.affectedRows) {
                                                                io.in('room'+msg_action.room_id).emit('message', {
                                                                    event: 'editted_css',
                                                                    to: {to:'room', id:msg_action.room_id},
                                                                    message: {
                                                                        success: 1,
                                                                        newname: newroomname,
                                                                        uid: session.user_id
                                                                    }
                                                                });
                                                                
                                                            } else {
                                                                io.in('room'+msg_action.room_id).emit('message', {
                                                                    event: 'editted_css',
                                                                    to: {to:'room', id:msg_action.room_id},
                                                                    message: {
                                                                        success: 0
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    );
                                                    
                                                }
                                            }
                                    );
                                    
                                    break;
                                }
                                
                                // Порядок вещания
                                // ----------------------------
                                case 'ordes': {
                                    connection.query(
                                            'SELECT id, creator FROM rooms WHERE id = :room_id LIMIT 1',
                                            {room_id:msg_action.room_id},
                                            function(error, results, fields) {
                                                if (!error && isset(results[0]) && results[0].creator==session.user_id) {
                                                    var ords = '0';
                                                    for (var i=0; i<msg_action.numeration.length; i++) {
                                                        msg_action.numeration[i] = parseInt(msg_action.numeration[i]);
                                                        ords = ords+','+parseInt(msg_action.numeration[i]);
                                                    }
                                                    connection.query(
                                                        'UPDATE rooms SET ord=:ord WHERE id=:room_id',
                                                        {ord:ords, room_id:msg_action.room_id},
                                                        function(err, res) {
                                                            console.log('saveorderr:', err);
                                                            if (!err && res.affectedRows) {
                                                                io.in('room'+msg_action.room_id).emit('message', {
                                                                    event: 'set_ord',
                                                                    to: {to:'room', id:msg_action.room_id},
                                                                    message: {
                                                                        success: 1,
                                                                        numeration:msg_action.numeration
                                                                    }
                                                                });
                                                                
                                                            } else {
                                                                io.in('room'+msg_action.room_id).emit('message', {
                                                                    event: 'set_ord',
                                                                    to: {to:'room', id:msg_action.room_id},
                                                                    message: {
                                                                        success: 0
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    );
                                                    
                                                }
                                            }
                                    );
                                    
                                    break;
                                }
                                
                                // Создание комнаты
                                // ----------------------------
                                case 'newroom': {
                                    console.log('newroom', msg_action)
                                     
                                    if (session.user_id && msg_action.room_name) {
                                    
                                        connection.query(
                                                'INSERT INTO rooms (room, creator, pwd, lang, ord) VALUES(:room, :creator, :pwd, :lang, "0")',
                                                {room:msg_action.room_name, creator:session.user_id, pwd:msg_action.password, lang:msg_action.lang},
                                                function(error, result) {
                                                    if(!error) {
                                                        socket.json.send({
                                                            event: 'room_create',
                                                            data: {room_id:result.insertId}
                                                        });
                                                    }
                                                }
                                        );
                                
                                    }
                                    
                                    break;
                                }
                                
                                // Вывод страницы с картинками пользователя
                                // ----------------------------
                                case 'photos': {
                                                                   /*             
                                        var str_html="";
                                        var dir = minpath;
                                        var files = fs.readdirSync(dir);

                                        for (var i in files){
                                            var name = minpath + files[i];
                                            var src = minpath_web + files[i];
                                            if (!fs.statSync(name).isDirectory()){
                                                try {
                                                var size = sizeOf(name); 
                                                } catch (e) {
                                                    console.log(e);
                                                }
                                                str_html += '<a href="'+fullpath_web+files[i]+'"><img src="'+src+'" width="'+size.width+'" height="'+size.height+'"></a>';
                                            }
                                        }
                                        
                                        
                                        socket.json.send({
                                            event: 'photos',
                                            isself: s,
                                            html: str_html
                                        });
                                        
                                    break;
                                     */
                                    
                                        start = msg_action.page*20;
                                        str_html="";
                                        
                                        connection.query(
                                                'SELECT * FROM users_photos WHERE user_id=:user_id ORDER BY upload_date desc LIMIT '+start+', 20; '+
                                                'SELECT count(id) as cnt FROM users_photos WHERE user_id=:user_id; ',
                                                {user_id:msg_action.user_id},
                                                function(err, res) {
                                                    var pages_count = Math.ceil(res[1][0]['cnt']/20);
                                                    for (var i = 0; i<res[0].length; i++) {
                                                        if (res[0][i].path == 'stamp') {
                                                            str_html += '<a href="/stamp.png" data-pid="'+res[0][i].id+'"><img src="/stamp.png" width="93" height="100"></a>'
                                                        } else { 
                                                            var path = "/home/zxc0/crawc.net/public/img/user"+msg_action.user_id+'/photos/min/'+res[0][i].path;
                                                            if (fs.existsSync(path)) {
                                                                var size = sizeOf(path);
                                                                var src = '/img/user'+msg_action.user_id+'/photos/min/'+res[0][i].path;
                                                                var img = '/img/user'+msg_action.user_id+'/photos/full/'+res[0][i].path;
                                                                if (size.width && size.height) str_html += '<a href="'+img+'" data-pid="'+res[0][i].id+'"><img src="'+src+'" width="'+size.width+'" height="'+size.height+'"></a>'
                                                            }
                                                        }
                                                    }
                                                    console.log('event photos');
                                                    socket.json.send({
                                                        event: 'photos',
                                                        isself: msg_action.user_id == session.user_id,
                                                        page: msg_action.page,
                                                        pages_count: pages_count,
                                                        html: str_html,
                                                        user_id: msg_action.user_id
                                                    });
                                                }
                                        );
                                        
                                        
                                        
                                        
                                        break;
                                }
                                
                                case 'voice': {
                                        
                                        console.log(msg_action);
                                        
                                        break;
                                }
                            
                                
                            }            
                                        
                                        
                                        
                                        // Конец проверки на бан
                                    }
                                }
                            )

                            
                    });
                    
                }
                
            }
            
        );

        // Socket disconnect
        // ----------------------------
        socket.on('disconnect', function() {

            console.log('DISCONNECT '+socket.id);

            connection.query(
                
                // Получаем все комнаты, где был только один сокет дисконектившегося клиента 
                /*
                'SELECT s.user_id as user_id, count(s.socket) as sockets_cnt, sir.room_id as room_id ' +
                'FROM sockets s ' +
                'LEFT JOIN sockets s2 ON s.user_id = s2.user_id '+
                'INNER JOIN sockets_in_rooms sir ON sir.socket_id = s.id ' +
                'WHERE s.socket = :socket_id '+
                'GROUP BY s.user_id, sir.room_id '+
                'HAVING sockets_cnt = 1',
                */
                'SELECT s.user_id as user_id, sir.room_id as room_id, s.socket, count(s.socket) as sockets_cnt '+
                'FROM sockets s '+
                'INNER JOIN sockets_in_rooms sir ON s.id = sir.socket_id '+
                'WHERE true '+
                'GROUP BY s.user_id, sir.room_id '+
                'HAVING s.socket = :socket_id ',
        
                {socket_id: socket.id},
                
                function (error, results, fields) {
                    console.log(error, results);
                    if (!error) {

                        connection.query(                                            
                            'DELETE s, sir FROM sockets s ' +
                            'LEFT JOIN sockets_in_rooms sir ON s.id = sir.socket_id ' +
                            'WHERE s.user_id = :user_id AND s.socket = :socket_id',
                            {user_id: session.user_id, socket_id: socket.id},
                            function(err, res) {
                                
                                if (!err && res.affectedRows) {
                                    console.log(results);
                                    for (var i in results) {
                                        socket.to('room'+results[i].room_id).emit('message', {
                                            event: 'client_leave_the_room',
                                            room_id: results[i].room_id,
                                            user_id: session.user_id
                                        });
                                    }

                                }
                            }
                        );

                    }
                }
            );

        });
        
    }
    
    connection.query(
            
        'SELECT um.id as id, um.from_id as user_id, um.message as message, u.name as user_name, um.gin as guest_name, IF(u.sex, "male", "female") as user_sex, um.date as date FROM users_messages um '+
        'LEFT JOIN users_last_readed_messages ulrm ON um.to_id = ulrm.to_id AND um.from_id = ulrm.from_id '+
        'INNER JOIN users u ON um.from_id = u.id '+
        'WHERE um.to_id=:user_id AND (ulrm.id IS NULL OR ulrm.lrm_id < um.id) '+
        'ORDER BY um.id, um.from_id ',

        {user_id: session.user_id},
                
        function (error, results, fields) {
                        
            for (var i in results) {                
                
                console.log({
                    event: 'new_message',
                    to: {to:'dialog', id:session.user_id},
                    message: {
                        id: results[i].id,
                        user_id: results[i].user_id,
                        user_name: results[i].user_name,
                        guest_name: results[i].guest_name,
                        user_sex: results[i].user_sex,
                        user_avatar: '',
                        message: results[i].message,
                        date: results[i].date
                    }
                });                
                
                socket.json.send({
                    event: 'new_message',
                    to: {to:'dialog', id:session.user_id},
                    message: {
                        id: results[i].id,
                        user_id: results[i].user_id,
                        user_name: results[i].user_name,
                        guest_name: results[i].guest_name,
                        user_sex: results[i].user_sex,
                        user_avatar: '',
                        message: results[i].message,
                        date: results[i].date
                    }
                });
            }
        }
    );

});

function quest(fromtext){
    var result="";
    var parts = fromtext.split('\n\n');
    head = parts[0].split('\n');
    ends = parts[parts.length-1].split("\n");
    result += "<div class='step step0'><h3>"+head[0]+"</h3><span>"+head[1]+"</span><button class='btn btn-default' onclick='qst($(this),0)'>пройти квест</button></div>"
    for(var i = 1; i < parts.length-1; i++) {
        var quest = parts[i].split('\n');
        if (quest[0][0] == '@') {type = 'radio'; name="name=i"+i}
        else if (quest[0][0] == "#") {type="checkbox"; name=""}
        var question=quest[0].substring(1); var answers = "";
        for (var j=1; j < quest.length; j++) {
            if (quest[j].charAt(0) == '!') {
                if (quest[j].indexOf('END') >= 0)
                    answers += '<input class="goto" type="hidden" value="1" data-points="'+parseInt(quest[j].substring(1))+'" data-vires="'+parseInt(quest[j].substring(quest[j].indexOf(':')+1))+'">';
                else
                    answers += '<input class="goto" type="hidden" value="1" data-points="'+parseInt(quest[j].substring(1))+'" data-step="'+parseInt(quest[j].substring(quest[j].indexOf(':')+1))+'">';
            } else {
                answers += '<input id="ij-'+i+'-'+j+'" type="'+type+'" '+name+' class="vi" value='+parseInt(quest[j])+'><label for="ij-'+i+'-'+j+'">'+quest[j].substring(4)+'</label><br>'
            }
        }
        result += '<div class="step"><h4>'+question + '</h4>'+answers+'<button class="btn btn-default" onclick="qst($(this))">ответить</button></div>';
    }
    for (var i=0; i < ends.length; i++) {
        ends[i] = ends[i].replaceArray({'([0-9]+)-([0-9]+): ([^\n]+)': '<div class="vires" data-min=$1 data-max=$2><h4>Твой результат:</h4>$3</div>'});
        result += ends[i];
    }
    return '<div class="qqq">'+result+'</div>';
}


// Слушаем веб-сервер чата
// -----------------------
app.listen(80, 'crawc.net');
io.listen(81)
/*
sh = srvlog = console.log;
app.listen(80, srvlog('\0\
\0■ webchat crawc.net ■\n\
\0m ■ ■ ■ ■ ■ ■ ■ ■ ■ f\n\
\0u ■ ◸ ◢ ■ ■ ■ ◣ ◹ ■ r\n\
\0l ■ ◢ ◤ ▷ ▽ ◁ ◥ ◣ ■ e\n\
\0t ■ ■ ▽ ◢ ■ ◣ ▽ ■ ■ e\n\
\0i ■ ■ ▷ ■ ❂ ■ ◁ ■ ■ t\n\
\0l ■ ■ △ ◥ ■ ◤ △ ■ ■ a\n\
\0a ■ ◥ ◣ ▷ △ ◁ ◢ ◤ ■ l\n\
\0n ■ ◺ ◥ ■ ■ ■ ◤ ◿ ■ k\n\
\0g ■ ■ ■ ■ ■ ■ ■ ■ ■ s\n\
\0■ created by gray25 ■\n\
\0WEB SERVER IS STARTED\n\
'));sh('\n');io.listen(81)
*/
