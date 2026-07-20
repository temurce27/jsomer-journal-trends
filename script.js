const fmt=n=>new Intl.NumberFormat('en-US').format(n);
fetch('data/journal-data.json').then(r=>r.json()).then(d=>{
 document.getElementById('updated').textContent=`Data updated ${d.meta.dataUpdated} · Coverage: ${d.meta.coverage}`;
 document.getElementById('footerDate').textContent=`Dashboard updated ${d.meta.dataUpdated}`;
 const cards=[['Publication years',d.summary.publicationYears],['Issues published',d.summary.issuesPublished],['Articles published',d.summary.articlesPublished],['Contributing authors',d.summary.contributingAuthors],['Countries represented',d.summary.countriesRepresented],['Article views',d.summary.articleViews],['PDF file requests',d.summary.pdfDownloads],['International collaborations',d.summary.internationalCollaborationArticles]];
 document.getElementById('summary').innerHTML=cards.map(([l,v])=>`<article class="card"><span class="value">${fmt(v)}</span><span class="label">${l}</span></article>`).join('');
 const bars=(items,labelKey,valueKey)=>{let max=Math.max(...items.map(x=>x[valueKey]));return items.map(x=>`<div class="bar-row"><span>${x[labelKey]}</span><div class="bar-track"><div class="bar-fill" style="width:${100*x[valueKey]/max}%"></div></div><span class="bar-value">${fmt(x[valueKey])}</span></div>`).join('')};
 document.getElementById('yearChart').innerHTML=bars(d.publicationByYear,'year','articles');
 document.getElementById('typeChart').innerHTML=bars(d.articleTypes,'label','count');
 document.getElementById('countryChart').innerHTML=bars(d.countries,'country','authors');
 document.getElementById('collabRate').textContent=`${d.summary.internationalCollaborationRate}%`;
 document.getElementById('collabText').textContent=`${d.summary.internationalCollaborationArticles} of ${d.summary.articlesPublished} published articles include authors affiliated with more than one country.`;
 const t=d.monthlyEngagement, max=Math.max(...t.views,...t.downloads);
 document.getElementById('timeline').innerHTML=t.labels.map((m,i)=>`<div class="month-group" title="${m}: ${fmt(t.views[i])} views; ${fmt(t.downloads[i])} PDF file requests"><div class="col views" style="height:${Math.max(1,100*t.views[i]/max)}%"></div><div class="col downloads" style="height:${Math.max(1,100*t.downloads[i]/max)}%"></div><span class="month-label">${m}</span></div>`).join('');
 const list=items=>items.map(x=>`<li><a href="${x.url}">${x.title}</a><span class="meta">${x.issue} · ${fmt(x.views)} views · ${fmt(x.downloads)} PDF file requests</span></li>`).join('');
 document.getElementById('topViewed').innerHTML=list(d.topViewed);
 document.getElementById('topDownloaded').innerHTML=list(d.topDownloaded);
 document.getElementById('modelGrid').innerHTML=d.publishingModel.map(x=>`<div class="model-item">${x}</div>`).join('');
}).catch(e=>{document.body.insertAdjacentHTML('beforeend','<p style="padding:20px;color:#b00020">Dashboard data could not be loaded.</p>');console.error(e)});