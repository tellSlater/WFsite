(function(){
    var sortLock=false, dlinks=[], db=document.getElementsByClassName('mli');
    for (var i=0;i<db.length;i++) {
      db[i].onclick=function(e){sortProjects(this);return false;}
      dlinks[i]= db[i].href==""?window.location.href:db[i].href;
    }
    
    function sortProjects(obj){
      var m = document.getElementById("mxmain"), mc = m.children, by=obj.innerHTML, s=[],p=[],ib,i,j,k;
    
      if (sortLock || obj.href=="") return;
      sortLock=true;
    
      for (i=0;i<db.length;i++) {db[i].style.backgroundColor='#F0F0F0';db[i].setAttribute('href',dlinks[i])}
      obj.style.backgroundColor='#CCCCCC';
      if (by!="Random") obj.removeAttribute('href');
    
      for (i=0;i<mc.length;i++) {
        if (mc[i].className == "pd") {
          mc[i].style.transition='1s';
    
          j = mc[i].getBoundingClientRect();
          k = {x:j.left - (window.mirrored?-parseInt(mc[i].style.left+0):parseInt(mc[i].style.left+0)), 
               y:j.top - parseInt(mc[i].style.top+0)};
          p.push(k);
          s.push([mc[i],k]);
    
          mc[i].style.left=parseInt(mc[i].style.left+0)+'px';
          mc[i].style.top=parseInt(mc[i].style.top+0)+'px';
          
        } else if (s.length) {ib=mc[i];break;}
      };
    
      switch(by){
        case 'Date':
          s.sort(function(a,b) {
            var da = a[0].innerHTML.split('<br>'),
                db = b[0].innerHTML.split('<br>'),
                na = Date.parse(da[4]||da[3]),
                nb = Date.parse(db[4]||db[3]);
            return na == nb ? 0 : (na > nb ? -1 : 1);
          }); 
        break;
        case 'Name':  
          s.sort(function(a,b) {
            var na = a[0].firstChild.firstChild.innerHTML.toLowerCase(),
                nb = b[0].firstChild.firstChild.innerHTML.toLowerCase();
            return na == nb ? 0 : (na > nb ? 1 : -1);
          }); 
        break;
        case 'Progress': 
          s.sort(function(a,b) {
            var na = a[0].firstChild.childNodes[4].innerHTML,
                nb = b[0].firstChild.childNodes[4].innerHTML;
            return na == nb ? 0 : (na > nb ? 1 : -1);
          }); 
        break;
        case 'Random':
          (function(a,b,c,d){c=a.length;while(c)b=Math.random()*c--|0,d=a[c],a[c]=a[b],a[b]=d})(s);
      }
    
      setTimeout(function(){
        for (i=0;i<s.length;i++) {
          s[i][0].style.left = (window.mirrored? s[i][1].x - p[i].x : p[i].x - s[i][1].x ) +'px';
          s[i][0].style.top = ( p[i].y - s[i][1].y ) +'px';
        }
        setTimeout(function(){
          for (i=0;i<s.length;i++) {
            s[i][0].style.left='0px';
            s[i][0].style.top='0px';
            s[i][0].style.transition='';
            m.insertBefore(s[i][0],ib);
          }
          sortLock=false;
        },1000);
      },100);
    }
    })();