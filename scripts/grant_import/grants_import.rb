require 'airtable'
require "active_support/core_ext/hash/indifferent_access"
require "active_support/core_ext/object/blank"
require './grants_classes'
require 'json'

class HashWithIndifferentAccess; end

DATA = %q{ACLU of Georgia,100.0,9/21/20
Action for Community Development (ACODEV),25.0,10/2/17
Affinity.works,10.0,5/2/17
African Community Center for Social Sustainability (ACCESS),150.1,10/2/17 (20); 12/18/18 (40); 8/1/19 (10.1); 12/18/19 (40); 6/1/20 (40)
Akira Chix,,1/1/19; 1/1/20; 1/1/21
Alameda County CASA Program,10.0,12/29/20
Analyst Institute,100.0,9/15/19
Aserto,50.0,9/1/20
Association pour la Santé des Communautés pour le Développement (SaCoDé),70.2,8/1/19 (30); 12/18/19 (20); 4/12/20 (20)
ATHENA Network,,1/1/19; 1/1/20; 1/1/21
Bixby Center for Population| Health and Sustainability,155.0,05/09/17 (50); 1/11/18 (25); 10/22/18 (25); 1/20/20 (30); 7/1/20 (25)
Blue Ventures,100.0,12/16/19 (50); 4/17/20 (50)
Cadence Health,325.0,12/30/16
Carafem,50.0,6/14/20
CarbonPlan,30.0,11/2/20
Centre for Girls Education,40.0,9/1/20
Chatterbug,,1/1/19; 1/1/20; 1/1/21
Code Climate,25.0,6/16/14
Contraceptive Access Initiative,25.0,2/18/21
Dandelion Africa,5.1,8/1/19
Decoupled,200.0,10/13/19 (50); 4/1/20 (100); 10/1/20 (50)
DKT International,50.0,7/1/2020
Emerge America,10.0,12/1/17
Fair Elections Center,25.0,9/28/20
Family Builders by Adoption,10.0,12/29/20
Fauna,100.0,1/1/20
First Exposures,5.0,12/29/20
Flone Initiative Trust,,1/1/19; 1/1/20; 1/1/21
Flux,50.0,1/1/20
Free Speech for People,1.0,10/2/17
Friends of the Earth ,25.0,2/22/21
Fuller Project for International Reporting,800.0,12/19/18 (50); 12/18/19 (250); 4/1/20 (250); 10/1/20 (250)
GALvanize Action,40.0,9/2/20
Global Fund for Women,1079.1,01/30/17 (10); 11/1/18 (100); 2/15/19 (449.7); 11/4/19 (100); 8/23/19 (5); 10/7/19 (110); 2/1/20 (149.7); 10/22/20 (105); 2/1/21 (149.7)
Hack Club,750.0,1/16/18 (250); 1/7/19 (250); 1/22/20 (250)
Humane Society of the US,40.0,12/20/19 (20); 11/20/20 (20)
Impossible Foods,930.0,1/3/2020
Initiatives des Jeunes Filles en Action (IJEFA),20.0,12/1/19
Integrate Health,100.0,12/18/19 (50); 4/17/20 (50)
Ipas,50.0,7/1/20
Just BE,10.0,7/1/20
Justice Is Global,200.0,6/30/20
Kabubbu Development Project,5.1,8/1/19
Kasha,75.0,1/1/18
Keteka,10.0,7/14/17
Kindle Orphan Outreach,10.5,8/1/19
Kora,250.0,4/17/19
Last Mile Health,25.0,4/17/20
Living Goods,475.0,10/1/17 (25); 12/18/18 (100); 12/17/19 (175); 6/15/20 (175)
Lwala Community Alliance,100.0,12/18/19 (50); 9/1/20 (50)
March for Our Lives Foundation,50.0,11/13/19
MedShare,135.0,5/8/20
Memphis Meats,1000.0,1/1/20
Midwife Pilgrim,5.0,12/14/18
More Perfect Union Action,175.0,1/14/21
Mother Health International,190.2,10/1/17 (20); 12/18/18 (40); 8/1/19 (10.2); 12/17/19 (60); 7/1/20 (60)
Movement Cooperative,75.0,9/9/19
Muso,170.0,12/18/19 (85); 4/17/20 (85)
Netlify,,2/29/16; 10/17/18; 12/13/19
New Florida Majority Education Fund,100.0,9/21/20
Nitricity,100.0,10/1/20
Nurx,,1/1/18
One For All Committee,10.0,9/2/20
One World Children's Fund,4.0,12/18/19
Organizing to Advance Solutions in the Sahel (OASIS),25.0,10/1/18
Partners in Health ,100.0,12/17/19 (50); 8/1/20 (50)
Path Water,100.0,1/1/20
People's Action,470.0,6/25/19 (10); 9/11/19 (200); 6/13/20 (200); 1/14/21 (60)
People's Action Institute,40.0,5/7/19
People's Lobby,50.0,10/2/17 (25); 10/11/18 (25)
People’s Action Power,50.0,9/9/20
Peripheral Vision International,250.0,12/19/18 (50); 12/17/19 (50); 6/1/20 (150)
PIVOT,50.0,12/18/19 (25); 5/3/20 (25)
Population Services International,5.1,8/1/19
Population Services International,1000.0,3/5/18
Possible Health,145.0,12/20/18 (50); 12/18/19 (50); 6/1/20 (45)
Prisma,50.0,12/5/19
Project Drawdown,25.0,2/10/20
Prometheus Fuels,1000.0,1/1/2020
Public Health Ambassadors Uganda,40.0,12/17/19 (20); 5/3/20 (20)
PushBlack,50.0,9/9/19
Railway,50.0,4/1/2020
Raise,50.0,12/6/2019
Raphael House,5.0,12/29/20
Reach a Hand,50.1,8/1/19 (10); 12/19/19 (20); 6/15/20 (20)
RedwoodJS,,1/1/19; 1/1/20
Replicated,160.0,2/4/15
Resource Center for Women and Girls,,1/1/19; 1/1/20; 1/1/21
Retool,10.0,5/16/19
Right to Health Action,50.0,2/23/21
Rural Women Peace Link,,1/1/19; 1/1/20; 1/1/21
San Francisco General Hospital Foundation,250.0,3/23/20
Shared Action Africa,80.0,12/18/18 (20); 12/18/19 (20); 6/1/20 (20); 12/15/20 (20)
Solugen,500.0,4/1/20
StackBlitz,50.0,4/1/20
Stream,50.0,7/1/20
Stripe,100.0,8/1/12
TakeShape,50.0,1/1/20
TeenSeed,,1/1/19; 1/1/20; 1/1/21
Texas Civil Rights Project ,10.0,9/21/20
The African Women's Development and Communication Network (FEMNET),,1/1/19; 1/1/20; 1/1/21
The San Francisco Foundation,250.0,3/23/20
The Voter Project Fund,100.0,10/1/20
This Ability Trust,,1/1/19; 1/1/20; 1/1/21
Tikkun Olam Productions,50.0,2/10/20
Tito,,5/1/17; 12/17/19
Trust for Indigenous Culture and Health (TICAH),,1/1/19; 1/1/20; 1/1/21
Undefined Labs,,7/10/18
University of California| San Francisco Foundation,350.0,3/23/20; 7/2/20
US Association for UNHCR,70.0,12/20/19 (50); 12/18/20 (50)
Venture Strategies for Health and Development,75.0,12/19/19 (50); 9/1/20 (25)
VillageReach,80.0,12/18/19 (40); 4/17/20 (40)
Waterkeeper Alliance,50.0,9/12/19 (25); 11/26/2020 (25)
Way to Win Action Fund,50.0,8/28/20
Weights and Biases,100.0,10/1/20
Western Uganda FBO Network,40.0,12/17/19 (20); 4/17/20 (20)
WISER International,40.0,12/17/19 (20); 6/1/20 (20)
Women Work Together (ADIMTU),30.4,3/1/21
Working Families Organization,150.0,1/14/21
Young Africa Women Initiatives (YAWI),,1/1/19; 1/1/20; 1/1/21
Young Men’s Christian Association of San Francisco,250.0,3/23/20
Youth Homes,10.0,12/29/20
ZanaAfrica Foundation,60.0,12/18/19 (30); 6/23/20 (30)}

client = Airtable::Client.new("keykHNSiioqJhDmJh")

# Get existing Grantees and their `rec` ids
table = client.table("appGCf62QAHvO11pr", "Grantees")
grantee_map = {}
all_records = []

records = table.records
all_records += records
records = table.records(:offset => records.offset)
all_records += records

all_records.each do |record|
  grantee_map[record.organization] = record.id
end


# Parse data and insert

table = client.table("appGCf62QAHvO11pr", "Grants")

importer = GrantImporter.new(DATA)
importer.parse

importer.grants.each do |grant|
  data = {
    'Grant ID'    => grant.id,
    'Grantees'    => [grantee_map[grant.grantee]],
    'Grant Date'  => grant.grant_date.strftime('%Y-%m-%d'),
    'Budget Year' => grant.budget_year
  }
  if grant.amount
    data.merge! 'Amount' => (grant.amount * 1000).to_i
  end

  record = Airtable::Record.new(data)
  table.create(record)
  puts "+ Added #{grant.grantee} #{grant.grant_date.to_s}"
rescue => e
  puts "! Error: #{e.message}\n#{e.backtrace}"
end
