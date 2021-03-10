require 'date'

class GrantDateConverter
  def self.convert(text)
    parts = text.split('/')
    year = parts[2]
    if year.split(' ').first.length == 2
      year = ('20' + parts[2].to_s).to_i
    else
      year = year.split(' ').first.to_i
    end
    month = parts[0].to_i
    day = parts[1].to_i

    Date.new(year, month, day)
  end
end

class Grantee

  attr_reader :name, :amount, :notes, :dates

  def initialize(data)
    parse(data)
  end

  def parse(data)
    columns = data.split(',')
    @name = columns[0].gsub('|', ',')
    @amount = columns[1].empty? ? nil : columns[1].to_f
    @dates = columns[2].split(';').collect { |v| v.strip }
  end

end

class Grant

  attr_reader :grantee, :id, :amount, :grant_date, :budget_year

  def initialize(options = {})
    @grantee = options[:grantee]
    @grant_date = GrantDateConverter.convert(options[:grant_date].split(' ').first)
    @budget_year = grant_date.year
    @id = (budget_year.to_s + options[:index].to_s.rjust(3, "0")).to_i

    if match = options[:grant_date].match(/\(([\d.]+)\)/)
      @amount = match[1].to_f
    else
      @amount = options[:amount] || nil
    end
  end

  def to_csv
    [id, grantee, '', amount, "#{grant_date.month}/#{grant_date.day}/#{grant_date.year}", budget_year].to_s
  end

end

class GrantImporter

  attr_reader :data, :grants

  def initialize(data)
    @data = data
    @grants = []
  end

  def parse
    indexes = { 2012 => 0, 2013 => 0, 2014 => 0, 2015 => 0, 2016 => 0, 2017 => 0, 2018 => 0, 2019 => 0, 2020 => 0, 2021 => 3 }
    rows = DATA.split("\n")
    grantees = rows.collect { |row| Grantee.new(row) }
    grantees.each do |grantee|
      @grants += grantee.dates.collect do |date|
        puts grantee.name
        parsed_date = GrantDateConverter.convert(date)
        puts parsed_date
        indexes[parsed_date.year] += 1
        Grant.new(grantee: grantee.name, grant_date: date, amount: grantee.amount, index: indexes[parsed_date.year])
      end
    end
  end

  def to_csv

  end

end
