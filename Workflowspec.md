Ians Claude code CLI workflow spec. 

Ian says /hello


Claude inspects entire codebase, checks what was done last. What still needs done from prior. Main branch should always be 100 percent error free, and have 100 percent uptime, because Ian's philosophy is that Test branch is where all new code goes, and gets tested meticulously until it passes test regimen 100 percent. Only then can be merged to main. Test regimen will be explained below
 
Repo has been made on github already at https://github.com/hondapowersr/Expressions.git  

Ian has google cloud account with thousands of dollars in credit and in the past projects ian has used the gemini research skill he created to point model requests at the endpoints from ai studio. with this project ian wants to utilize google cloud and the available tools on there for image generation. At the appropriate time, generate a document called Gcloud_AI_setup that gives instructians to ian how to setup the proper permissions on google cloud for claude to use the gcloud mcp server to setup google cloud for the project, and whatever the mcp server cant do after proper setup, create another document with instructions for ian to set it up on the google cloud website


Claude tells Ian a summary of inspection. If there are pending items, list them in order or priority for Ian to pick from. If there is nothing pending, just summarize where current codebase is at. And what was done last. No pending items=can begining /planning


/Planning should be where “Ideas” for currennt website/app are cooked up.. “ideas” can be a feature for existing app, simple updates, UI changes, security hardening, SEO, admin related stuff (business planning, making  supporting documents, marketing, fund raising, and more). If Ian has no “ideas” already, then use inspection from before to come up with new ideas
For researching, use the Gemini API research tool Ian made. To save Claude the tokens by offloading research to Gemini automatically. 




Once “idea(s)” have been come up with. Pick existing tools or Create the proper tools and figure out what  order to use them (mcps, hooks. Skills, agents, plugins, and everything else you can use) to implement “idea(s)”. Priority's during implementation are quality, being meticulous, doing things with intent and not just because, double or triple checking research, logging all work and how and why things are done. For easy rewind or easy debugging when things don't go as expected, keeping .MD files, and all tools up to date and documented as we go. Keeping any intellectual property out of public accessable code, security centric coding, usage of all available tools to be efficient and effective. When you are coding, always build it so the air logging is specific and easy to debug. Once  an idea is  uploaded to test, testing regimen can begin and will be explained next. 


My regimen has been that you use Chrome Dev tools MCP to open the test branches preview site at test.app-name-goes-here.pages.dev, load the site, test all features and endpoints. Click all UI buttons to test for proper function. Use the site in all the ways that could break something. Open chrome dev console, check logs, debug and fix code, repeat, until no more errors and all things work. Confirm within Ian. This allows testing the entire stack all the way to end users experience all at once because we are testing live site hosted on cloudflare. This should always live as the main testing apparatus. Once test Branch passed this regiment, then it only then can it be merged to production, that keeps production at 100% up time and 0% errors because only perfectly working code gets pushed due to this stringent test regimen. 


I want to explore other testing regimens, so as a side thought, work with Ian to plan secondary test regimens. The main regimen is mandatory for complete confidence in in it's right. However it eats up tokens, if we can break up the tasks into different areas for testing do them separately And offload them into another shell or Gemini or some other way where it saves tokens or is more efficient or more effective, that would be ideal, so we could run all the less token heavy tests first and hopefully fix as many things as possible before moving on to the main test regimen. That way the main test regimen spends less time having to fix things. 


Ian is providing this document inside of the flock yourself code base so first this is all going to apply to the flock yourself project. So build all the tools and things custom tailored to The demand of what this code based is . 


But I want to use this spec, for any and all projects past, present or future.  So make another version of this document, that you can save in claude's global settings that I can call when I am in any project. I want to be able to open Claude in any projects, and type /ianspec, and call the universal version of this document into  the project, to build /hello. Have /hello initiate the same workflow as described throughout this document but custom to whatever project I'm in at that time. Each projects /hello after being built, should follow the same structure, but customized to be best for any certain project.