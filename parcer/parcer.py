from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
from socket import error as SocketError

# final dataframe
df = pd.DataFrame(
    columns=
    [
        'id', 'Supplements', 'Category', 'Full_name', 'Brand', 'Rating',
        'Count_review', 'Price', 'Link', 'Serving_size', 'Composition'
    ])

try:
    # parsing category links of each supplement type
    def parse_by_suppl(suppl):
        r_suppl = requests.get(
            url=f'https://www.iherb.com/c/{suppl}',
            params={'avids': '32372%2C32410%2C32415%2C32413%2C32400', 'noi': '192'},
            headers={'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US, en;q=0.5'}
        )
        # result of request
        soup_suppl = BeautifulSoup(r_suppl.text, 'lxml')

        # finding category blocks
        categories = [cat.select('div a')[0] for cat in soup_suppl.find_all(class_='filter-links')]
        # getting category links
        links_cat = [a['href'] for a in categories]

        # parsing items of each categories
        def parse_by_cat(link_cat):
            r_cat = requests.get(
                f'https://www.iherb.com/c/{link_cat}',
                headers={'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US, en;q=0.5'}
            )

            # result of request
            soup_cat = BeautifulSoup(r_cat.text, 'lxml')
            # getting item links
            links_item = [item.select('a.absolute-link')[0]['href'] for item in
                          soup_cat.find_all(class_="product-cell-container col-xs-12 col-sm-12 col-md-8 col-lg-6")]

            # parsing data items
            def parse_by_item(link_item):
                r_item = requests.get(
                    link_item,
                    headers={'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US, en;q=0.5'}
                )

                # result of request
                soup_item = BeautifulSoup(r_item.text, 'lxml')

                # getting main item information
                # id, supplement name, category name, full name, brand name, rating, count of review, price, link
                result = [
                    soup_item.select('article.ga-product input')[0]['data-product-id'],
                    suppl,
                    re.match(r'.*(?=\?)', link_cat).group(),
                    soup_item.select('h1#name')[0].string,
                    soup_item.select('div#brand a bdi')[0].text,
                    float(re.match(r'.*(?=\/)', str(soup_item.select('a.stars')[0]['title'])).group())
                    if soup_item.select('a.stars') != [] else 'NULL',
                    int(re.search(r'[0-9]*(?= Отзывы)', str(soup_item.select('a.stars')[0]['title'])).group())
                    if soup_item.select('a.stars') != [] else 'NULL',
                    float(re.sub(r'[₽,]', '', str(soup_item.select('div.row div#price')[0].text.strip())))
                    if soup_item.select('div.row div#price') != [] else 'NULL',
                    link_item
                ]

                # handling serving size of item
                if soup_item.select('div.supplement-facts-container tr') != []:
                    if re.search(r'(?<![,\d])(\d)[\D]',
                                 str(soup_item.select('div.supplement-facts-container tr')[1].text)) is not None:
                        result.append(
                            int(re.search(r'(?<![,\d])(\d)[\D]',
                                          str(soup_item.select('div.supplement-facts-container tr')[1].text)).group(1)))
                    elif re.search(r'одна',
                                   str(soup_item.select('div.supplement-facts-container tr')[1].text)) is not None:
                        result.append(1)
                    else:
                        result.append('NULL')
                else:
                    result.append('NULL')

                # handling composition of item
                if soup_item.select('div.supplement-facts-container tr') != []:
                    for tr in range(len(soup_item.select('div.supplement-facts-container tr'))):
                        if re.match(r'.*width="70%".*',
                                    str(soup_item.select('div.supplement-facts-container tr')[tr])) is not None:
                            result.append(
                                [re.sub(r'(\(.*\))|(\\xa0)|(\s?†)', '',
                                        str(soup_item.select('div.supplement-facts-container tr')[i].text))
                                 for i in range(tr + 1, len(soup_item.select('div.supplement-facts-container tr')) - 1)]
                            )
                            break
                        if tr == len(soup_item.select('div.supplement-facts-container tr')) - 1:
                            result.append('NULL')
                else:
                    result.append('NULL')
                return result

            return [parse_by_item(link) for link in links_item]

        return [parse_by_cat(link_cat) for link_cat in links_cat]

except SocketError as e:
    print(f'SocketError: {e}')


# total parsed supplement data
total = [parse_by_suppl(suppl) for suppl in ['Vitamins', 'Minerals', 'Amino-Acids',
                                             'Fish-Oil-Omegas-EPA-DHA', 'Greens-Superfoods']]

# iterating over elements and filling the dataframe with data
for suppl in total:
    for cat in suppl:
        for item in cat:
            df = pd.concat([df, pd.DataFrame([(item[0], item[1], item[2], item[3], item[4],
                                               item[5], item[6], item[7], item[8], item[9], item[10])],
                            columns=['id', 'Supplements', 'Category', 'Full_name', 'Brand', 'Rating',
                                     'Count_review', 'Price', 'Link', 'Serving_size', 'Composition'])],
                           ignore_index=False).drop_duplicates(subset=['id'])

# save to csv file
df.to_csv('../data/data.csv', index=False)
