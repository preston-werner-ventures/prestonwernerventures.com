require './grants_classes'
require 'minitest/autorun'

class GranteeTest < Minitest::Test

  def test_grantee_parsed_correctly
    grantee = Grantee.new("ACLU of Georgia,100.0,9/21/20")

    assert_equal grantee.name, 'ACLU of Georgia'
  end

end

class GrantTest < Minitest::Test

  def test_grant_parses_single_date
    grant = Grant.new(
      grantee: 'ACLU of Georgia',
      amount: 100.0,
      grant_date: '1/1/20',
      index: 1
    )

    assert_equal grant.grantee, 'ACLU of Georgia'
    assert_equal grant.amount, 100.0
    assert_equal grant.grant_date, Date.new(2020,1,1)
    assert_equal grant.id, 2020001
    assert_equal grant.budget_year, 2020
  end

  def test_grant_parses_date_with_amount
    grant = Grant.new(
      grantee: 'ACLU of Georgia',
      amount: nil,
      grant_date: '10/1/19 (50)',
      index: 1
    )

    assert_equal grant.grantee, 'ACLU of Georgia'
    assert_equal grant.amount, 50.0
    assert_equal grant.grant_date, Date.new(2019,10,1)
    assert_equal grant.id, 2019001
    assert_equal grant.budget_year, 2019
  end

  def test_grant_handles_date_amounts_with_a_decimal
    grant = Grant.new(
      grantee: 'ACLU of Georgia',
      amount: nil,
      grant_date: '10/1/19 (10.5)',
      index: 1
    )

    assert_equal grant.amount, 10.5
  end

  def test_grant_parses_date_without_amount
    grant = Grant.new(
      grantee: 'ACLU of Georgia',
      amount: nil,
      grant_date: '10/1/19',
      index: 1
    )

    assert_nil grant.amount
    assert_equal grant.grant_date, Date.new(2019,10,1)
  end

  def test_grant_outputs_to_csv
    grant = Grant.new(
      grantee: 'ACLU of Georgia',
      amount: 100.0,
      grant_date: '1/1/20',
      index: 1
    )

    assert_equal '[2020001, "ACLU of Georgia", "", 100.0, "1/1/2020", 2020]', grant.to_csv
  end

end

DATA = %q{ACLU of Georgia,100.0,9/21/20
Action for Community Development (ACODEV),25.0,10/2/17
Affinity.works,10.0,5/2/17
African Community Center for Social Sustainability (ACCESS),150.1,10/2/17 (20); 12/18/18 (40); 8/1/19 (10.1); 12/18/19 (40); 6/1/20 (40)
Akira Chix,,1/1/19; 1/1/20; 1/1/21}

class GrantImporterTest < Minitest::Test

  def setup
    importer = GrantImporter.new(DATA)
    importer.parse
    @grants = importer.grants
  end

  def test_parses_all_grants
    assert_equal @grants.size, 11
  end

  def test_handles_grants_with_an_amount
    grants = @grants.find_all { |g| g.grantee == "ACLU of Georgia" }

    assert_equal grants.size, 1
    assert_equal grants[0].amount, 100.0
  end

  def test_handles_grants_with_date_amounts
    grants = @grants.find_all { |g| g.grantee.match(/ACCESS/) }

    assert_equal grants.size, 5
    assert_equal grants[0].amount, 20.0
    assert_equal grants[0].grant_date, Date.new(2017, 10, 2)
    assert_equal grants[0].budget_year, 2017
    assert_equal grants[1].amount, 40.0
    assert_equal grants[1].grant_date, Date.new(2018, 12, 18)
    assert_equal grants[1].budget_year, 2018
    assert_equal grants[2].amount, 10.1
    assert_equal grants[2].grant_date, Date.new(2019, 8, 1)
    assert_equal grants[2].budget_year, 2019
    assert_equal grants[3].amount, 40.0
    assert_equal grants[3].grant_date, Date.new(2019, 12, 18)
    assert_equal grants[3].budget_year, 2019
    assert_equal grants[4].amount, 40.0
    assert_equal grants[4].grant_date, Date.new(2020, 6, 1)
    assert_equal grants[4].budget_year, 2020
  end

  def test_handles_grants_with_no_date_amount
    grants = @grants.find_all { |g| g.grantee == 'Akira Chix' }

    assert_equal grants.size, 3
    assert_nil grants[0].amount
    assert_nil grants[1].amount
    assert_nil grants[2].amount
  end
end
