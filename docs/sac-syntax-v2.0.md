<article class="ltx_document">
<a href="https://www.sac-home.org/docs:syntax_2_0">
<div id="p1" class="ltx_para">
<p class="ltx_p ltx_align_center"><span class="ltx_text" style="font-size:298%;">SaC <span class="ltx_text" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">v2.0
</span> Syntax</span></p>
</a>

<section id="S1" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">1 </span>Program Structure</h2>

<div id="S1.p1" class="ltx_para">
<table class="ltx_tabular ltx_align_top">
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">prg</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S1.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_italic">module</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_italic">class</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>

<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">interface</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S1.p1.m2" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td"></td>
<td class="ltx_td ltx_align_left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">structdef</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S1.p1.m3" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>

<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">typedef</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S1.p1.m4" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">objectdef</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S1.p1.m5" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">function</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S1.p1.m6" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="S2" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">2 </span>Module Declarations</h2>

<div id="S2.p1" class="ltx_para">
<table class="ltx_tabular ltx_align_top">
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">module</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S2.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">module</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">deprecated</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">str</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">class</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S2.p1.m2" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">class</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">deprecated</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">str</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter">;</span>

<span class="ltx_text ltx_font_italic">classtype</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">classtype</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S2.p1.m3" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">classtype</span>
 <span class="ltx_text ltx_font_italic">type</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S2.p1.m4" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">extern</span>
 <span class="ltx_text ltx_font_bold">classtype</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">interface_pragma</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S2.p1.m5" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="S3" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">3 </span>Import / Export</h2>

<div id="S3.p1" class="ltx_para">
<table class="ltx_tabular ltx_align_top">
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">interface</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S3.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">import</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">use</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>

<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter">:</span>
 <span class="ltx_text ltx_font_italic">symbolset</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S3.p1.m2" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">export</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">provide</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
 <span class="ltx_text ltx_font_italic">symbolset</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">symbolset</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S3.p1.m3" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">all</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">except</span>

<span class="ltx_text ltx_font_typewriter">{</span>
 <span class="ltx_text ltx_font_italic">ext_id</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">,</span>

<span class="ltx_text ltx_font_italic">ext_id</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter">}</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S3.p1.m4" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter">{</span>
 <span class="ltx_text ltx_font_italic">ext_id</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">,</span>

<span class="ltx_text ltx_font_italic">ext_id</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter">}</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="S4" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">4 </span>Structure Definitions</h2>

<div id="S4.p1" class="ltx_para">
<table class="ltx_tabular ltx_align_top">
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">structdef</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S4.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">struct</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter">{</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">type</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>

<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S4.p1.m2" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_typewriter">;</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S4.p1.m3" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_typewriter">}</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="S5" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">5 </span>Type Definitions</h2>

<div id="S5.p1" class="ltx_para">
<table class="ltx_tabular ltx_align_top">
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">typedef</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S5.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">loctypedef</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S5.p1.m2" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_italic">exttypedef</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;">



<span class="ltx_text ltx_font_italic">loctypedef</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S5.p1.m3" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">typedef</span>
  <span class="ltx_text ltx_font_italic">type</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">exttypedef</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S5.p1.m4" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">external</span>
 <span class="ltx_text ltx_font_bold">typedef</span>
 
<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">interface_pragma</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S5.p1.m5" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="S6" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">6 </span>Object Definitions</h2>

<div id="S6.p1" class="ltx_para">
<table class="ltx_tabular ltx_align_top">
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">objectdef</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S6.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_italic">locobjdef</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_italic">extobjdef</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">locobjdef</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S6.p1.m2" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">objdef</span>
 <span class="ltx_text ltx_font_italic">type</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 = <span class="ltx_text ltx_font_italic">funcall</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">extobjdef</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S6.p1.m3" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">external</span>
 <span class="ltx_text ltx_font_bold">objdef</span>
 <span class="ltx_text ltx_font_italic">type</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">interface_pragma</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S6.p1.m4" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="S7" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">7 </span>Function Declarations and Definitions</h2>

<div id="S7.p1" class="ltx_para">
<table class="ltx_tabular ltx_align_top">
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">function</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S7.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">extfundec</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_italic">interface_pragma</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_italic">funtion_pragma</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S7.p1.m2" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S7.p1.m3" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">specfundec</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">function_pragma</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S7.p1.m4" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S7.p1.m5" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">fundef</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S7.p1.m6" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_italic">main</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">extfundec</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S7.p1.m7" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">external</span>
 <span class="ltx_text ltx_font_italic">varsignature</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">specfundec</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S7.p1.m8" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">specialize</span>
 <span class="ltx_text ltx_font_italic">fixsignature</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">fundef</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S7.p1.m9" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">inline</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">noinline</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
  <span class="ltx_text ltx_font_italic">fixsignature</span>

<span class="ltx_text ltx_font_typewriter" style="font-size: 120%; color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">[</span><span class="ltx_text" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color=""> <span class="ltx_text ltx_font_typewriter">|</span>
 <span class="ltx_text ltx_font_italic">exprs</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span></span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">function_pragma</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S7.p1.m10" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_italic">body</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">fixsignature</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S7.p1.m11" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">fixrets</span>
 <span class="ltx_text ltx_font_italic">ext_id</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">fixargs</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S7.p1.m12" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_italic">operator_sig</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">varsignature</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S7.p1.m13" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">varrets</span>
 <span class="ltx_text ltx_font_italic">ext_id</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">varargs</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S7.p1.m14" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_italic">operator_sig</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">operator_sig</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S7.p1.m15" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">type</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">ext_op</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">arg</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S7.p1.m16" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_italic">type</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">ext_op</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">arg</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">arg</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">fixargs</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S7.p1.m17" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_italic">arg</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">arg</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S7.p1.m18" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">void</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">varargs</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S7.p1.m19" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">fixargs</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S7.p1.m20" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_italic">arg</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">,</span>
 <span class="ltx_text ltx_font_italic">arg</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S7.p1.m21" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_typewriter">...</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">arg</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S7.p1.m22" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_italic" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">type_pattern<span class="ltx_text ltx_font_upright">
</span></span> <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">&amp;</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">fixrets</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S7.p1.m23" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp; <span class="ltx_text ltx_font_italic" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">rtype_pattern<span class="ltx_text ltx_font_upright">
</span></span> <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">rtype_pattern<span class="ltx_text ltx_font_upright">
<span class="ltx_text ltx_font_typewriter" style="font-size: 120%; color: rgb(0, 0, 0); --darkreader-inline-color: var(--darkreader-text-000000, #e8e6e3);" data-darkreader-inline-color="">]</span></span></span>
<math id="S7.p1.m24" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">void</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">varrets</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S7.p1.m25" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">fixrets</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S7.p1.m26" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_italic" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">rtype_pattern<span class="ltx_text ltx_font_upright">
</span></span> <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">,</span>
 <span class="ltx_text ltx_font_italic" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">rtype_pattern<span class="ltx_text ltx_font_upright">
<span class="ltx_text ltx_font_typewriter" style="font-size: 120%; color: rgb(0, 0, 0); --darkreader-inline-color: var(--darkreader-text-000000, #e8e6e3);" data-darkreader-inline-color="">]</span></span></span>
<math id="S7.p1.m27" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_typewriter">...</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">main</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S7.p1.m28" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">int</span>
 <span class="ltx_text ltx_font_bold">main</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">void</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
 <span class="ltx_text ltx_font_italic">body</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="S8" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">8 </span>Function Bodies</h2>

<div id="S8.p1" class="ltx_para">
<table class="ltx_tabular ltx_align_top">
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">body</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S8.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter">{</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">cachesim_pragma</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>

<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">vardec</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S8.p1.m2" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">statement</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S8.p1.m3" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">return</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>

<span class="ltx_text ltx_font_typewriter">}</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">vardec</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S8.p1.m4" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_italic">type</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S8.p1.m5" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">statement</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S8.p1.m6" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">;</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S8.p1.m7" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">assignment</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S8.p1.m8" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">funcall</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S8.p1.m9" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">withloop</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S8.p1.m10" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">cond</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S8.p1.m11" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">doloop</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S8.p1.m12" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">whileloop</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S8.p1.m13" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_italic">forloop</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">return</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S8.p1.m14" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">return</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">expr</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S8.p1.m15" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">return</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">exprs</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">assignment</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S8.p1.m16" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">assign_lhs</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">assign_lhs</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S8.p1.m17" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_italic">assign_op</span>
 <span class="ltx_text ltx_font_italic">expr</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S8.p1.m18" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_italic">assign_lhs</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_typewriter">++</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">--</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">assign_lhs</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S8.p1.m19" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S8.p1.m20" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">assign_lhs</span>
 <span class="ltx_text ltx_font_typewriter">[</span>
 <span class="ltx_text ltx_font_italic">exprs</span>
 <span class="ltx_text ltx_font_typewriter">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S8.p1.m21" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_italic">assign_lhs</span>
 <span class="ltx_text ltx_font_typewriter">.</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">assign_op</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S8.p1.m22" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_typewriter">=</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">+=</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">-=</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">*=</span>

<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">/=</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">%=</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">cond</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S8.p1.m23" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">if</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
 <span class="ltx_text ltx_font_italic">statementblock</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">else</span>

<span class="ltx_text ltx_font_italic">statementblock</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">doloop</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S8.p1.m24" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">do</span>
 <span class="ltx_text ltx_font_italic">statementblock</span>

<span class="ltx_text ltx_font_bold">while</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
 <span class="ltx_text ltx_font_typewriter">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">whileloop</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S8.p1.m25" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">while</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
 <span class="ltx_text ltx_font_italic">statementblock</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">forloop</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S8.p1.m26" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">for</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">assignment</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span>  <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">assignment</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S8.p1.m27" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td"></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter">;</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">;</span>

<span class="ltx_text ltx_font_italic">assignment</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span>  <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">assignment</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S8.p1.m28" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_italic">statementblock</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">statementblock</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S8.p1.m29" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter">{</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">cachesim_pragma</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">statement</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S8.p1.m30" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_typewriter">}</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S8.p1.m31" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_italic">statement</span></td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="S9" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">9 </span>Expressions</h2>

<div id="S9.p1" class="ltx_para">
<table class="ltx_tabular ltx_align_top">
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">exprs</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S9.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span>  <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S9.p1.m2" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">expr_or_dot</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S9.p1.m3" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_italic">expr</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">.</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">expr_or_mdot</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S9.p1.m4" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">.</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">...</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">expr</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m5" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">const</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m6" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">qual_ext_id</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m7" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">funcall</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m8" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">withloop</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m9" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">tensor_comp</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m10" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">array</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m11" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">struct</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m12" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">||</span>
 <span class="ltx_text ltx_font_italic">expr</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m13" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">&amp;&amp;</span>
 <span class="ltx_text ltx_font_italic">expr</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m14" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">?</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">:</span>
 <span class="ltx_text ltx_font_italic">expr</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m15" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter">(</span>
<span class="ltx_text ltx_font_italic">type</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
 <span class="ltx_text ltx_font_italic">expr</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S9.p1.m16" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">arrray</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m17" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter">[</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">exprs</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m18" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter">[</span>
 <span class="ltx_text ltx_font_typewriter">:</span>
<span class="ltx_text ltx_font_italic">type</span>
 <span class="ltx_text ltx_font_typewriter">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S9.p1.m19" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">[</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">expr_or_mdot</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span>  <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">expr_or_mdot</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S9.p1.m20" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">struct</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m21" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter">{</span>
 <span class="ltx_text ltx_font_italic">exprs</span>
 <span class="ltx_text ltx_font_typewriter">}</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m22" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter">{</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">.</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter">=</span>
 <span class="ltx_text ltx_font_italic">expr</span>

<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_typewriter">.</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter">=</span>
 <span class="ltx_text ltx_font_italic">expr</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S9.p1.m23" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter">}</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S9.p1.m24" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">.</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">funcall</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m25" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">qual_ext_id</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span>  <span class="ltx_text ltx_font_italic">exprs</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m26" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">unary_prf</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m27" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">qual_ext_op</span>
 <span class="ltx_text ltx_font_italic">expr</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m28" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">binary_prf</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m29" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_italic">qual_ext_op</span>
 <span class="ltx_text ltx_font_italic">expr</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S9.p1.m30" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_italic">ternary_prf</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">tensor_comp</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S9.p1.m31" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter">{</span>
 <span class="ltx_text ltx_font_italic">tc_def</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">;</span>
 <span class="ltx_text ltx_font_italic">tc_def</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S9.p1.m32" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_typewriter">}</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">tc_def</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m33" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter">-&gt;</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> &nbsp;<math id="S9.p1.m34" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math>
 <span class="ltx_text ltx_font_italic">tc_constraint</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S9.p1.m35" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter">[</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">id_or_mdot</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span>  <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">id_or_mdot</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S9.p1.m36" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter">]</span>

<span class="ltx_text ltx_font_typewriter">-&gt;</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> &nbsp;<math id="S9.p1.m37" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math>
 <span class="ltx_text ltx_font_italic">tc_constraint</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">tc_constraint</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m38" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_typewriter">&lt;</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">&lt;=</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_italic">id_vec</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>

<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">step</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">width</span>
 <span class="ltx_text ltx_font_italic">expr</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m39" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_italic">id_vec</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_typewriter">&lt;</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">&lt;=</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
 <span class="ltx_text ltx_font_italic">expr</span>

<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">step</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">width</span>
 <span class="ltx_text ltx_font_italic">expr</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S9.p1.m40" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_typewriter">&lt;</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">&lt;=</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_italic">id_vec</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>

<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_typewriter">&lt;</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">&lt;=</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
 <span class="ltx_text ltx_font_italic">expr</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">step</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">width</span>
 <span class="ltx_text ltx_font_italic">expr</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="S10" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">10 </span>With-Loops</h2>

<div id="S10.p1" class="ltx_para">
<table class="ltx_tabular ltx_align_top">
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">withloop</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S10.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">with</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">generators</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_bold">:</span>
 <span class="ltx_text ltx_font_italic">operations</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">generators</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S10.p1.m2" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">{</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">withloop_pragma</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">generator</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S10.p1.m3" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_bold">}</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">generator</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S10.p1.m4" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">(</span>
 <span class="ltx_text ltx_font_italic">index_set</span>
 <span class="ltx_text ltx_font_bold">)</span>

<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">generator_pragma</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>

<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">{</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">statement</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S10.p1.m5" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_bold">}</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>

<span class="ltx_text ltx_font_bold">:</span>
 <span class="ltx_text ltx_font_italic">gen_exprs</span>
 <span class="ltx_text ltx_font_bold">;</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">index_set</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S10.p1.m6" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic">expr_or_dot</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_typewriter">&lt;</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">&lt;=</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
 <span class="ltx_text ltx_font_italic">index_vars</span>

<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_typewriter">&lt;</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">&lt;=</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
 <span class="ltx_text ltx_font_italic">expr_or_dot</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">step</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">width</span>
 <span class="ltx_text ltx_font_italic">expr</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">index_vars</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S10.p1.m7" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">=</span>
 <span class="ltx_text ltx_font_italic">id_vec</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S10.p1.m8" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_italic">id_vec</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">id_vec</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S10.p1.m9" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">[</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">,</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S10.p1.m10" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_bold">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">gen_exprs</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S10.p1.m11" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">void</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S10.p1.m12" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">expr</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S10.p1.m13" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">(</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">,</span>
 <span class="ltx_text ltx_font_italic">expr</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S10.p1.m14" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_bold">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">operations</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S10.p1.m15" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">void</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S10.p1.m16" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">operation</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S10.p1.m17" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">(</span>
 <span class="ltx_text ltx_font_italic">operation</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">,</span>
 <span class="ltx_text ltx_font_italic">operation</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S10.p1.m18" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
 <span class="ltx_text ltx_font_bold">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">operation</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S10.p1.m19" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">genarray</span>
 <span class="ltx_text ltx_font_bold">(</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">,</span>
 <span class="ltx_text ltx_font_italic">expr</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_bold">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S10.p1.m20" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">modarray</span>
 <span class="ltx_text ltx_font_bold">(</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_bold">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S10.p1.m21" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">fold</span>
 <span class="ltx_text ltx_font_bold">(</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_italic">qual_ext_id</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_italic">qual_ext_op</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">(</span>
 <span class="ltx_text ltx_font_italic">exprs</span>
 <span class="ltx_text ltx_font_bold">)</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_bold">,</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_bold">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S10.p1.m22" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">foldfix</span>
 <span class="ltx_text ltx_font_bold">(</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_italic">qual_ext_id</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_italic">qual_ext_op</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_bold">(</span>
 <span class="ltx_text ltx_font_italic">exprs</span>
 <span class="ltx_text ltx_font_bold">)</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_bold">,</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_bold">,</span>
 <span class="ltx_text ltx_font_italic">expr</span>
 <span class="ltx_text ltx_font_bold">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S10.p1.m23" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">propagate</span>
 <span class="ltx_text ltx_font_bold">(</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_bold">)</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="S11" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">11 </span>Types</h2>

<div id="S11.p1" class="ltx_para">
<table class="ltx_tabular ltx_guessed_headers ltx_align_top">
<thead class="ltx_thead">
<tr class="ltx_tr">
<th class="ltx_td ltx_align_justify ltx_align_top ltx_th ltx_th_column" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">type</span></span>
</span>
</th>
<th class="ltx_td ltx_align_center ltx_th ltx_th_column" style="padding-bottom:3.44444pt;"><math id="S11.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></th>
<th class="ltx_td ltx_align_left ltx_th ltx_th_column" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_italic">basetype</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic">shape_spec</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
</th>
</tr>
<tr class="ltx_tr">
<th class="ltx_td ltx_align_justify ltx_align_top ltx_th ltx_th_column">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">shape_spec</span></span>
</span>
</th>
<th class="ltx_td ltx_align_center ltx_th ltx_th_column"><math id="S11.p1.m2" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></th>
<th class="ltx_td ltx_align_left ltx_th ltx_th_column">
<span class="ltx_text ltx_font_typewriter">[</span>
 <span class="ltx_text ltx_font_typewriter">*</span>
 <span class="ltx_text ltx_font_typewriter">]</span>
</th>
</tr>
</thead>
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<th class="ltx_td ltx_align_center ltx_th ltx_th_column"><math id="S11.p1.m3" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></th>
<th class="ltx_td ltx_align_left ltx_th ltx_th_column">
<span class="ltx_text ltx_font_typewriter">[</span>
 <span class="ltx_text ltx_font_typewriter">+</span>
 <span class="ltx_text ltx_font_typewriter">]</span>
</th>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<th class="ltx_td ltx_align_center ltx_th ltx_th_column"><math id="S11.p1.m4" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></th>
<th class="ltx_td ltx_align_left ltx_th ltx_th_column">
<span class="ltx_text ltx_font_typewriter">[</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">.</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_typewriter">.</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S11.p1.m5" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter">]</span>
</th>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S11.p1.m6" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter">[</span>
 <span class="ltx_text ltx_font_italic">nums</span>
 <span class="ltx_text ltx_font_typewriter">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">rtype_pattern<span class="ltx_text ltx_font_upright"></span></span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S11.p1.m7" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo mathcolor="#B40000" stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_italic" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">type_pattern<span class="ltx_text ltx_font_upright">
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">{</span>
 </span>id<span class="ltx_text ltx_font_upright">
 <span class="ltx_text ltx_font_typewriter">}</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span></span></span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">type_pattern<span class="ltx_text ltx_font_upright"></span></span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S11.p1.m8" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo mathcolor="#B40000" stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_italic" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">basetype<span class="ltx_text ltx_font_upright">
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">[</span>
 </span>features<span class="ltx_text ltx_font_upright">
 <span class="ltx_text ltx_font_typewriter">]</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span></span></span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">features<span class="ltx_text ltx_font_upright"></span></span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S11.p1.m9" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo mathcolor="#B40000" stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size: 120%; color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">[</span><span class="ltx_text" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color=""> <span class="ltx_text ltx_font_italic">feature</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">feature</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S11.p1.m10" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathcolor="#B40000" mathsize="200%">*</mtext></msub></msup></math>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span></span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">feature<span class="ltx_text ltx_font_upright"></span></span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S11.p1.m11" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo mathcolor="#B40000" stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size: 120%; color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">(</span><span class="ltx_text" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">&nbsp;<span class="ltx_text ltx_font_italic">single</span>
<span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_italic">multiple</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span></span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">single<span class="ltx_text ltx_font_upright"></span></span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m12" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo mathcolor="#B40000" stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">.</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m13" class="ltx_Math" alttext="|" display="inline"><mo fence="false" mathcolor="#B40000" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">num</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S11.p1.m14" class="ltx_Math" alttext="|" display="inline"><mo fence="false" mathcolor="#B40000" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">id</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">multiple<span class="ltx_text ltx_font_upright"></span></span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m15" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo mathcolor="#B40000" stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">*</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m16" class="ltx_Math" alttext="|" display="inline"><mo fence="false" mathcolor="#B40000" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">+</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m17" class="ltx_Math" alttext="|" display="inline"><mo fence="false" mathcolor="#B40000" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">id</span><span class="ltx_text" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">&gt;</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">num</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_typewriter">:</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span></span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S11.p1.m18" class="ltx_Math" alttext="|" display="inline"><mo fence="false" mathcolor="#B40000" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">num</span><span class="ltx_text" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">
 <span class="ltx_text ltx_font_typewriter">:</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span></span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">basetype</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m19" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">simpletype</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m20" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic">usertype</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S11.p1.m21" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_italic">structtype</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">simpletype</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m22" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">byte</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m23" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">short</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m24" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">int</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m25" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">long</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m26" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">longlong</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m27" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">ubyte</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m28" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">ushort</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m29" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">uint</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m30" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">ulong</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m31" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">ulonglong</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m32" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">float</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m33" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">bool</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S11.p1.m34" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">char</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S11.p1.m35" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_bold">double</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">structtype</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S11.p1.m36" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter">::</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_bold">struct</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">usertype</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S11.p1.m37" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter">::</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="S12" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">12 </span>Identifiers</h2>

<div id="S12.p1" class="ltx_para">
<table class="ltx_tabular ltx_align_top">
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">id_or_mdot</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S12.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">.</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_typewriter">...</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">qual_ext_id</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S12.p1.m2" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span>  <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter">::</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_italic">ext_id</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">ext_id</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S12.p1.m3" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_italic">reservedid</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">reservedid</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m4" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">genarray</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m5" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">modarray</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m6" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">fold</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m7" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">foldfix</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m8" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">propagate</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m9" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">all</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S12.p1.m10" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_bold">except</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">qual_ext_op</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S12.p1.m11" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span>  <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">id</span>
 <span class="ltx_text ltx_font_typewriter">::</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
 <span class="ltx_text ltx_font_italic">ext_op</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">ext_op</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S12.p1.m12" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">op</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_italic">reservedop</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">reservedop</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m13" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">&amp;</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m14" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">&amp;&amp;</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m15" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">||</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m16" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">!</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m17" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">~</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m18" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">+</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m19" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">-</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m20" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">*</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m21" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">/</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m22" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">%</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m23" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">&lt;=</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m24" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">&lt;</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m25" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">&gt;=</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m26" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">&gt;</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m27" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">&gt;&gt;</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m28" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">&lt;&lt;</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m29" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">^</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S12.p1.m30" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_typewriter">++</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S12.p1.m31" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_typewriter">--</span></td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="S13" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">13 </span>Constants</h2>

<div id="S13.p1" class="ltx_para">
<table class="ltx_tabular ltx_align_top">
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">const</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">numbyte</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m2" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">numshort</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m3" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">numint</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m4" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">numlong</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m5" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">numlonglong</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m6" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">numubyte</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m7" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">numushort</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m8" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">numuint</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m9" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">numulong</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m10" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">numulonglong</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m11" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">num</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m12" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">float</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m13" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">double</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m14" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">char</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m15" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">str</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S13.p1.m16" class="ltx_Math" alttext="{}^{\hbox{+}}" display="inline"><msup><mi></mi><mtext>+</mtext></msup></math>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S13.p1.m17" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">true</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S13.p1.m18" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_bold">false</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">nums</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S13.p1.m19" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">num</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">num</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S13.p1.m20" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="S14" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">14 </span>Builtin Operations</h2>

<div id="S14.p1" class="ltx_para">
<table class="ltx_tabular ltx_align_top">
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">unary_prf</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_tob_S_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_tos_S_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_toi_S_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_tol_S_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_toll_S_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m2" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_toub_S_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_tous_S_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_toui_S_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_toul_S_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_toull_S_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m3" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">_tof_S_</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m4" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">_tod_S_</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m5" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">_toc_S_</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m6" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">_tobool_S_</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m7" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_not_S_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_not_V_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m8" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_neg_S_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_neg_V_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m9" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_abs_S_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_abs_V_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m10" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">_dim_A_</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S14.p1.m11" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_bold">_shape_A_</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">ternary_prf</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S14.p1.m12" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_bold">_modarray_AxVxS_</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">binary_prf</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m13" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_add_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_add_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_add_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_add_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m14" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_sub_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_sub_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_sub_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_sub_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m15" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_mul_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_mul_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_mul_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_mul_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m16" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_div_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_div_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_div_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_div_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m17" class="ltx_Math" alttext="|" display="inline"><mo fence="false" mathcolor="#B40000" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size: 120%; color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">(</span><span class="ltx_text" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">&nbsp;<span class="ltx_text ltx_font_bold">_aplmod_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_aplmod_SxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span></span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m18" class="ltx_Math" alttext="|" display="inline"><mo fence="false" mathcolor="#B40000" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size: 120%; color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">(</span><span class="ltx_text" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">&nbsp;<span class="ltx_text ltx_font_bold">_aplmod_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_aplmod_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span></span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m19" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_mod_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_mod_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_mod_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_mod_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m20" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_min_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_min_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_min_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_min_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m21" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_max_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_max_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_max_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_max_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m22" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_eq_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_eq_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_eq_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_eq_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m23" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_neq_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_neq_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_neq_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_neq_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m24" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_le_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_le_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_le_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_le_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m25" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_lt_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_lt_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_lt_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_lt_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m26" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_ge_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_ge_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_ge_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_ge_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m27" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_gt_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_gt_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_gt_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_gt_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m28" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_and_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_and_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_and_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_and_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m29" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">(</span>&nbsp;<span class="ltx_text ltx_font_bold">_or_SxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_or_SxV_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_or_VxS_</span>
 <span class="ltx_text ltx_font_italic">|</span>&nbsp;<span class="ltx_text ltx_font_bold">_or_VxV_</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m30" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">_reshape_VxA_</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m31" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">_sel_VxA_</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m32" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">_take_SxV_</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S14.p1.m33" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">_drop_SxV_</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S14.p1.m34" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;"><span class="ltx_text ltx_font_bold">_cat_VxV_</span></td>
</tr>
</tbody>
</table>
</div>
</section>
<section id="S15" class="ltx_section">
<h2 class="ltx_title ltx_title_section page-header pb-3 mb-4 mt-5">
<span class="ltx_tag ltx_tag_section">15 </span>Pragmas</h2>

<div id="S15.p1" class="ltx_para">
<table class="ltx_tabular ltx_align_top">
<tbody class="ltx_tbody">
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;">



<span class="ltx_text ltx_font_italic">interface_pragma</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m1" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">linkname</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">str</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m2" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">header</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">str</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m3" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">linkwith</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">str</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S15.p1.m4" class="ltx_Math" alttext="{}^{\hbox{+}}" display="inline"><msup><mi></mi><mtext>+</mtext></msup></math>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m5" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">linkobj</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">str</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S15.p1.m6" class="ltx_Math" alttext="{}^{\hbox{+}}" display="inline"><msup><mi></mi><mtext>+</mtext></msup></math>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m7" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">copyfun</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">str</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m8" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">freefun</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">str</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m9" class="ltx_Math" alttext="|" display="inline"><mo fence="false" mathcolor="#B40000" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">#<span class="ltx_text ltx_font_medium">
 </span>pragma<span class="ltx_text ltx_font_medium">
 </span>ctype<span class="ltx_text ltx_font_medium">
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">str</span></span></span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m10" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">linksign</span>
 <span class="ltx_text ltx_font_typewriter">[</span>
<span class="ltx_text ltx_font_italic">nums</span>
<span class="ltx_text ltx_font_typewriter">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m11" class="ltx_Math" alttext="|" display="inline"><mo fence="false" mathcolor="#B40000" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">#<span class="ltx_text ltx_font_medium">
 </span>pragma<span class="ltx_text ltx_font_medium">
 </span>sacarg<span class="ltx_text ltx_font_medium">
 <span class="ltx_text ltx_font_typewriter">[</span>
<span class="ltx_text ltx_font_italic">nums</span>
<span class="ltx_text ltx_font_typewriter">]</span></span></span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m12" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">refcounting</span>
 <span class="ltx_text ltx_font_typewriter">[</span>
<span class="ltx_text ltx_font_italic">nums</span>
<span class="ltx_text ltx_font_typewriter">]</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m13" class="ltx_Math" alttext="|" display="inline"><mo fence="false" mathcolor="#B40000" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold" style="color: rgb(180, 0, 0); --darkreader-inline-color: var(--darkreader-text-b40000, #ff4e4e);" data-darkreader-inline-color="">#<span class="ltx_text ltx_font_medium">
 </span>pragma<span class="ltx_text ltx_font_medium">
 </span>gpumem<span class="ltx_text ltx_font_medium">
 <span class="ltx_text ltx_font_typewriter">[</span>
<span class="ltx_text ltx_font_italic">nums</span>
<span class="ltx_text ltx_font_typewriter">]</span></span></span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S15.p1.m14" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">effect</span>
 <span class="ltx_text ltx_font_italic">qual_ext_id</span>

<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">qual_ext_id</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S15.p1.m15" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">withloop_pragma</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m16" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">wlcomp</span>
 <span class="ltx_text ltx_font_italic">wc_funcall</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S15.p1.m17" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">nocuda</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">generator_pragma</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S15.p1.m18" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">gpukernel</span>
 <span class="ltx_text ltx_font_bold">GridBlock</span>
 <span class="ltx_text ltx_font_typewriter">(</span>

<span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">num</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">gk_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">wc_funcall</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m19" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">Default</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m20" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">All</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m21" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">Cubes</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m22" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">ConstSegs</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">[</span>
<span class="ltx_text ltx_font_italic">nums</span>
<span class="ltx_text ltx_font_typewriter">]</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_typewriter">[</span>
<span class="ltx_text ltx_font_italic">nums</span>
<span class="ltx_text ltx_font_typewriter">]</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S15.p1.m23" class="ltx_Math" alttext="{}^{\hbox{+}}" display="inline"><msup><mi></mi><mtext>+</mtext></msup></math>
 <span class="ltx_text ltx_font_italic">wc_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m24" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">NoBlocking</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">wc_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m25" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">BvL0</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">[</span>
<span class="ltx_text ltx_font_italic">nums</span>
<span class="ltx_text ltx_font_typewriter">]</span>
<span class="ltx_text ltx_font_typewriter">,</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S15.p1.m26" class="ltx_Math" alttext="{}^{\hbox{+}}" display="inline"><msup><mi></mi><mtext>+</mtext></msup></math>
 <span class="ltx_text ltx_font_italic">wc_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m27" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">BvL1</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">[</span>
<span class="ltx_text ltx_font_italic">nums</span>
<span class="ltx_text ltx_font_typewriter">]</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S15.p1.m28" class="ltx_Math" alttext="{}^{\hbox{+}}" display="inline"><msup><mi></mi><mtext>+</mtext></msup></math>
 <span class="ltx_text ltx_font_italic">wc_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m29" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">BvL2</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">[</span>
<span class="ltx_text ltx_font_italic">nums</span>
<span class="ltx_text ltx_font_typewriter">]</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S15.p1.m30" class="ltx_Math" alttext="{}^{\hbox{+}}" display="inline"><msup><mi></mi><mtext>+</mtext></msup></math>
 <span class="ltx_text ltx_font_italic">wc_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m31" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">Ubv</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_typewriter">[</span>
<span class="ltx_text ltx_font_italic">nums</span>
<span class="ltx_text ltx_font_typewriter">]</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S15.p1.m32" class="ltx_Math" alttext="{}^{\hbox{+}}" display="inline"><msup><mi></mi><mtext>+</mtext></msup></math>
 <span class="ltx_text ltx_font_italic">wc_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m33" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">Scheduling</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">sched_param</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">wc_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S15.p1.m34" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">Tasksel</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">tsel_param</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">wc_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">gk_funcall</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m35" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left"><span class="ltx_text ltx_font_bold">Gen</span></td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m36" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">ShiftLB</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">gk_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m37" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">CompressGrid</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_typewriter">[</span>
<span class="ltx_text ltx_font_italic">nums</span>
<span class="ltx_text ltx_font_typewriter">]</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">gk_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m38" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">Permute</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_typewriter">[</span>
<span class="ltx_text ltx_font_italic">nums</span>
<span class="ltx_text ltx_font_typewriter">]</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">gk_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m39" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">FoldLast2</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic">gk_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top"></td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m40" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">SplitLast</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">num</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">gk_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S15.p1.m41" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">PadLast</span>
 <span class="ltx_text ltx_font_typewriter">(</span>
 <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">num</span>
 <span class="ltx_text ltx_font_typewriter">,</span>
 <span class="ltx_text ltx_font_italic">gk_funcall</span>
 <span class="ltx_text ltx_font_typewriter">)</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top" style="padding-bottom:3.44444pt;">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">cachesim_pragma</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S15.p1.m42" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">cachesim</span>
 <span class="ltx_text ltx_font_typewriter" style="font-size:120%;">[</span> <span class="ltx_text ltx_font_italic ltx_framed ltx_framed_underline">str</span>
<span class="ltx_text ltx_font_typewriter" style="font-size:120%;">]</span>
<math id="S15.p1.m43" class="ltx_Math" alttext="{}^{{}_{\hbox{\normalsize*}}}" display="inline"><msup><mi></mi><msub><mi></mi><mtext mathsize="200%">*</mtext></msub></msup></math>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_justify ltx_align_top">
<span class="ltx_inline-block ltx_align_top">
<span class="ltx_p" style="width:65.4pt;"><span class="ltx_text ltx_font_italic">function_pragma</span></span>
</span>
</td>
<td class="ltx_td ltx_align_center"><math id="S15.p1.m44" class="ltx_Math" alttext="\Rightarrow" display="inline"><mo stretchy="false">⇒</mo></math></td>
<td class="ltx_td ltx_align_left">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">recountdots</span>
</td>
</tr>
<tr class="ltx_tr">
<td class="ltx_td ltx_align_top" style="padding-bottom:3.44444pt;"></td>
<td class="ltx_td ltx_align_center" style="padding-bottom:3.44444pt;"><math id="S15.p1.m45" class="ltx_Math" alttext="|" display="inline"><mo fence="false" stretchy="false">|</mo></math></td>
<td class="ltx_td ltx_align_left" style="padding-bottom:3.44444pt;">
<span class="ltx_text ltx_font_bold">#</span>
 <span class="ltx_text ltx_font_bold">pragma</span>
 <span class="ltx_text ltx_font_bold">noinline</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
</article>